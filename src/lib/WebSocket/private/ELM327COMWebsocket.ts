/* 
 * The MIT License
 *
 * Copyright 2017 kuniaki.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import {VALInterpolationBuffer} from "./utils/Interpolation";
import * as JSONFormats from "./JSONFormats";
import {WebsocketCommon} from "./WebsocketCommon";
import {ReadModeCode} from "./parameterCode/ReadModeCode";
import {OBDIIParameterCode} from "./parameterCode/OBDIIParameterCode";
import {EnumUtils} from "../../EnumUtils";

export class ELM327COMWebsocket extends WebsocketCommon
{
    private onVALPacketReceived : (intervalTime : number, val:{[code : string] : string}) => void;

    //Internal state
    private valPacketPreviousTimeStamp : number;
    private valPacketIntervalTime : number;

    //Interpolate value buffer
    private interpolateBuffers: {[code: string]: VALInterpolationBuffer} = {};
    
    constructor()
    {
        super();
        this.modePrefix = "ELM327";
        this.valPacketPreviousTimeStamp = window.performance.now();
        this.valPacketIntervalTime = 0;
    }

    private checkInterpolateBufferAndCreateIfEmpty(code: string): void
    {
        if(!(code in this.interpolateBuffers))
            this.interpolateBuffers[code] = new VALInterpolationBuffer();            
    }

    public getVal(code : OBDIIParameterCode, timestamp : number) : number
    {
        const codeStr = OBDIIParameterCode[code];
        this.checkInterpolateBufferAndCreateIfEmpty(codeStr);
        return this.interpolateBuffers[codeStr].getVal(timestamp);
    }

    public getRawVal(code : OBDIIParameterCode) : number
    {
        const codeStr = OBDIIParameterCode[code];
        this.checkInterpolateBufferAndCreateIfEmpty(codeStr);
        return this.interpolateBuffers[codeStr].getRawVal();
    }
    
    public SendCOMRead(code: OBDIIParameterCode, readmode: ReadModeCode, flag: boolean): void
    {
        if (!this.IsConnetced)
            return;

        let sendCOMReadObj = new JSONFormats.SendCOMReadJSONMessage();
        sendCOMReadObj.mode = this.modePrefix + "_COM_READ";
        sendCOMReadObj.code = OBDIIParameterCode[code];
        sendCOMReadObj.read_mode = ReadModeCode[readmode];
        sendCOMReadObj.flag = flag;
        const jsonstr = JSON.stringify(sendCOMReadObj);
        this.WebSocket.send(jsonstr);
    }

    public SendSlowreadInterval(interval : number)
    {
        if (!this.IsConnetced)
            return;

        let sendSlowreadIntervalObj = new JSONFormats.SendSlowReadIntervalJSONMessage();
        sendSlowreadIntervalObj.mode = this.modePrefix + "_SLOWREAD_INTERVAL";
        sendSlowreadIntervalObj.interval = interval;
        const jsonstr = JSON.stringify(sendSlowreadIntervalObj);
        this.WebSocket.send(jsonstr);
    }

    private processVALJSONMessage(receivedJson: JSONFormats.StringVALJSONMessage) : void
    {
        //Update interval time
        var nowTime = window.performance.now();
        this.valPacketIntervalTime = nowTime - this.valPacketPreviousTimeStamp;
        this.valPacketPreviousTimeStamp = nowTime;

        // Invoke VALPacketReceived Event
        if ( typeof(this.onVALPacketReceived) !== "undefined" )
            this.onVALPacketReceived(this.valPacketIntervalTime, receivedJson.val);
        
        // Store value into interpolation buffers
        for (let key in receivedJson.val)
        {            
            const valStr : string = receivedJson.val[key];
            
            if(EnumUtils.IsEnumContaninsKey(OBDIIParameterCode, key))
            {
                const val: number = Number(valStr);
                // Register to interpolate buffer
                this.checkInterpolateBufferAndCreateIfEmpty(key);
                this.interpolateBuffers[key].setVal(val);
            }
            else
                throw EvalError("Key of VAL message is not found in OBDIIParameterCode. key=" + key);
        }
    }
    
    private processERRJSONMessage(receivedJson: JSONFormats.ErrorJSONMessage)
    {
        if (typeof (this.OnERRPacketReceived) !== "undefined")
            this.OnERRPacketReceived(receivedJson.msg);
    }
    
    private processRESJSONMessage(receivedJson: JSONFormats.ResponseJSONMessage)
    {
        if(typeof (this.OnRESPacketReceived) !== "undefined")
            this.OnRESPacketReceived(receivedJson.msg);
    }
    
    protected parseIncomingMessage(msg : string) : void
    {
        const receivedJson : any = JSON.parse(msg);
        const modeCode : string = (<JSONFormats.IJSONMessage>receivedJson).mode;
        switch (modeCode)
        {
            case ("VAL") :
                this.processVALJSONMessage(<JSONFormats.StringVALJSONMessage>receivedJson);
                break;
            case("ERR"):
                this.processERRJSONMessage(<JSONFormats.ErrorJSONMessage>receivedJson);
                break;
            case("RES"):
                this.processRESJSONMessage(<JSONFormats.ResponseJSONMessage>receivedJson);
                break;
            default:
                this.OnWebsocketError("Unknown mode packet received. " + msg);
        };
    }

    public get OnVALPacketReceived() {return this.onVALPacketReceived};
    public set OnVALPacketReceived(func) {this.onVALPacketReceived = func };
    public get VALPacketIntervalTime(): number { return this.valPacketIntervalTime; }
}
