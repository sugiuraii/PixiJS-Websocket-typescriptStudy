/* 
 * Copyright (c) 2017, kuniaki
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * * Redistributions of source code must retain the above copyright notice, this
 *   list of conditions and the following disclaimer.
 * * Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

/// <reference path="../lib/webpackRequire.ts" />

import {ELM327COMWebsocket} from "../lib/WebSocket/WebSocketCommunication";
import {OBDIIParameterCode} from "../lib/WebSocket/WebSocketCommunication";
import {SSMELM327COMWSTestBase} from "./base/SSMELM327WSTestBase";

import * as $ from "jquery";
require('./ELM327COMWSTest.html');

window.onload = function () {
    let wsTest = new ELM327COMWSTest();
    wsTest.main();
}

export class ELM327COMWSTest extends SSMELM327COMWSTestBase {
    constructor()
    {
        const webSocket = new ELM327COMWebsocket();
        super(webSocket);
        this.defaultPortNo = 2016;
    }

    protected setParameterCodeSelectBox() {
        for (let code in OBDIIParameterCode)
            $('#codeSelect').append($('<option>').html(code).val(code));
    }
}

