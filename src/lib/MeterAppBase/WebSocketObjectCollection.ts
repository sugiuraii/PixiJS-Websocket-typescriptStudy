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

import { DefiWebsocketBackend } from "./WebsocketAppBackend/DefiWebsocketBackend";
import { SSMWebsocketBackend } from "./WebsocketAppBackend/SSMWebsocketBackend";
import { ArduinoWebsocketBackend } from "./WebsocketAppBackend/ArduinoWebsocketBackend";
import { ELM327WebsocketBackend } from "./WebsocketAppBackend/ELM327WebsocketBackend";
import { AssettoCorsaSHMWebsocketBackend } from "./WebsocketAppBackend/AssettoCorsaSHMWebsocketBackend";
import { FUELTRIPWebsocketBackend } from "./WebsocketAppBackend/FUELTRIPWebsocketBackend";
import { MeterApplicationOption } from "./options/MeterApplicationOption"
import { ApplicationNavBar } from "./bootstrapParts/ApplicationNavBar"

export class WebsocketObjectCollection {
    private readonly AppOption: MeterApplicationOption;

    private readonly defiWS: DefiWebsocketBackend | undefined;
    private readonly ssmWS: SSMWebsocketBackend | undefined;
    private readonly arduinoWS: ArduinoWebsocketBackend | undefined;
    private readonly elm327WS: ELM327WebsocketBackend | undefined;
    private readonly fueltripWS: FUELTRIPWebsocketBackend | undefined;
    private readonly assettoCorsaWS: AssettoCorsaSHMWebsocketBackend | undefined;

    get DefiWS(): DefiWebsocketBackend {
        if (this.defiWS != undefined)
            return this.defiWS as DefiWebsocketBackend;
        else
            throw ReferenceError("DefiWSBackend is not defined.");
    }

    get SSMWS(): SSMWebsocketBackend {
        if (this.ssmWS != undefined)
            return this.ssmWS as SSMWebsocketBackend;
        else
            throw ReferenceError("SSMWSBackennd is not defined.");
    }

    get ArduinoWS(): ArduinoWebsocketBackend {
        if (this.arduinoWS != undefined)
            return this.arduinoWS as ArduinoWebsocketBackend;
        else
            throw ReferenceError("ArduinoWSBackennd is not defined.");
    }

    get ELM327WS(): ELM327WebsocketBackend {
        if (this.elm327WS != undefined)
            return this.elm327WS as ELM327WebsocketBackend;
        else
            throw ReferenceError("ELM327WSBackennd is not defined.");
    }

    get FUELTRIPWS(): FUELTRIPWebsocketBackend {
        if (this.fueltripWS != undefined)
            return this.fueltripWS as FUELTRIPWebsocketBackend;
        else
            throw ReferenceError("FUELTRIPWSBackennd is not defined.");
    }

    get AssettoCorsaWS(): AssettoCorsaSHMWebsocketBackend {
        if (this.assettoCorsaWS != undefined)
            return this.assettoCorsaWS as AssettoCorsaSHMWebsocketBackend;
        else
            throw ReferenceError("AssettoCorsaSHMWSBackennd is not defined.");
    }

    private getWebsocketServerName(): string {
        const wsServerHostname: string = (typeof localStorage.getItem("WSServerHostname") === "string") ? localStorage.getItem("WSServerHostname") as string : "localhost";
        const setWSServerSameAsHttpSite: boolean = localStorage.getItem("SetWSServerSameAsHttp") === "true" ? true : false;
        if (setWSServerSameAsHttpSite)
            return location.hostname;
        else
            return wsServerHostname;
    }

    constructor(navBar: ApplicationNavBar, appOption: MeterApplicationOption) {
        this.AppOption = appOption;

        const webSocketServerName = this.getWebsocketServerName();
        const logDialog = navBar.LogModalDialog;

        if (appOption.WebsocketEnableFlag.Defi) {
            const wsURL = "ws://" + webSocketServerName + ":" + DefiWebsocketBackend.DEFAULT_WS_PORT.toString() + "/";
            navBar.AddWebSocketStatusIndicator("defiWSIndicator", "Defi");
            this.defiWS = new DefiWebsocketBackend(wsURL, this.AppOption.ParameterCode.Defi.Array, logDialog, navBar.GetWebSocketStatusIndicator("defiWSIndicator"));
        }
        else
            this.defiWS = undefined;

        if (appOption.WebsocketEnableFlag.SSM) {
            const wsURL = "ws://" + webSocketServerName + ":" + SSMWebsocketBackend.DEFAULT_WS_PORT.toString() + "/";
            navBar.AddWebSocketStatusIndicator("ssmWSIndicator", "SSM");
            this.ssmWS = new SSMWebsocketBackend(wsURL, this.AppOption.ParameterCode.SSM.Array, logDialog, navBar.GetWebSocketStatusIndicator("ssmWSIndicator"));
        }
        else
            this.ssmWS = undefined;

        if (appOption.WebsocketEnableFlag.Arduino) {
            const wsURL = "ws://" + webSocketServerName + ":" + ArduinoWebsocketBackend.DEFAULT_WS_PORT.toString() + "/";
            navBar.AddWebSocketStatusIndicator("arduinoWSIndicator", "Arduino");
            this.arduinoWS = new ArduinoWebsocketBackend(wsURL, this.AppOption.ParameterCode.Arduino.Array, logDialog, navBar.GetWebSocketStatusIndicator("arduinoWSIndicator"));
        }
        else
            this.arduinoWS = undefined;

        if (appOption.WebsocketEnableFlag.ELM327) {
            const wsURL = "ws://" + webSocketServerName + ":" + ELM327WebsocketBackend.DEFAULT_WS_PORT.toString() + "/";
            navBar.AddWebSocketStatusIndicator("elm327WSIndicator", "ELM327");
            this.elm327WS = new ELM327WebsocketBackend(wsURL, this.AppOption.ParameterCode.ELM327OBDII.Array, logDialog, navBar.GetWebSocketStatusIndicator("elm327WSIndicator"));
        }
        else
            this.elm327WS = undefined;

        if (appOption.WebsocketEnableFlag.FUELTRIP) {
            const wsURL = "ws://" + webSocketServerName + ":" + FUELTRIPWebsocketBackend.DEFAULT_WS_PORT.toString() + "/";
            navBar.AddWebSocketStatusIndicator("fueltripWSIndicator", "FUELTRIP");
            const fuelTripSectSpan = appOption.FUELTRIPWebsocketOption.FUELTRIPSectSpan;
            const fuelTripSectStoreMax = appOption.FUELTRIPWebsocketOption.FUELTRIPSectStoreMax;
            this.fueltripWS = new FUELTRIPWebsocketBackend(wsURL, logDialog, fuelTripSectSpan, fuelTripSectStoreMax, navBar.GetWebSocketStatusIndicator("fueltripWSIndicator"));
        }
        else
            this.fueltripWS = undefined;

        if (appOption.WebsocketEnableFlag.AssettoCorsaSHM) {
            const wsURL = "ws://" + webSocketServerName + ":" + AssettoCorsaSHMWebsocketBackend.DEFAULT_WS_PORT.toString() + "/";
            navBar.AddWebSocketStatusIndicator("acshmWSIndicator", "AssettoCorsaSHM");
            this.assettoCorsaWS = new AssettoCorsaSHMWebsocketBackend(wsURL,
                this.AppOption.ParameterCode.AssettoCorsaPhysics.Array,
                this.AppOption.ParameterCode.AssettoCorsaGraphics.Array,
                this.AppOption.ParameterCode.AssettoCorsaStaticInfo.Array,
                logDialog, navBar.GetWebSocketStatusIndicator("acshmWSIndicator"));
        }
        else
            this.assettoCorsaWS = undefined;
    }

    public Run(): void {
        if (this.AppOption.WebsocketEnableFlag.Defi)
            this.DefiWS.Run();
        if (this.AppOption.WebsocketEnableFlag.SSM)
            this.SSMWS.Run();
        if (this.AppOption.WebsocketEnableFlag.Arduino)
            this.ArduinoWS.Run();
        if (this.AppOption.WebsocketEnableFlag.ELM327)
            this.ELM327WS.Run();
        if (this.AppOption.WebsocketEnableFlag.FUELTRIP)
            this.FUELTRIPWS.Run();
        if (this.AppOption.WebsocketEnableFlag.AssettoCorsaSHM)
            this.AssettoCorsaWS.Run();
    }
}