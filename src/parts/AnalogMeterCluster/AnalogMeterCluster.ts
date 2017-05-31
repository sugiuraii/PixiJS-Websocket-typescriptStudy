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
 
 /// <reference path="../../lib/webpackRequire.ts" />

import {CircularProgressBar} from '../../lib/Graphics/PIXIGauge';
import {RotationNeedleGauge} from '../../lib/Graphics/PIXIGauge';
import PIXI = require('pixi.js');

require("./AnalogMeterClusterTexture.json");
require("./AnalogMeterClusterTexture.png");
require("../fonts/font.css");
require("../fonts/DSEG_v030/DSEG14Classic-BoldItalic.ttf");
require("./AnalogMeterFont_115px.fnt");
require("./AnalogMeterFont_45px.fnt");
require("./AnalogMeterFont_40px.fnt");
require("./AnalogMeterFont_60px.fnt");

require("./AnalogMeterFont_115px_0.png");
require("./AnalogMeterFont_45px_0.png");
require("./AnalogMeterFont_40px_0.png");
require("./AnalogMeterFont_60px_0.png");

export class AnalogMeterCluster extends PIXI.Container
{
    private tachoProgressBar = new CircularProgressBar();
    private waterTempProgressBar = new CircularProgressBar();
    private tachoNeedleGauge = new RotationNeedleGauge();
    private speedNeedleGauge = new RotationNeedleGauge();
    private boostNeedleGauge = new RotationNeedleGauge();

    private speedLabel: PIXI.extras.BitmapText;
    private gasMilageLabel: PIXI.extras.BitmapText;
    private tripLabel: PIXI.extras.BitmapText;
    private fuelLabel: PIXI.extras.BitmapText;
    private gearPosLabel: PIXI.extras.BitmapText;

    private tacho = 0;
    private speed = 0;
    private boost = 0;
    private waterTemp = 0;
    private gasMilage = 0;
    private trip = 0;
    private fuel = 0;
    private gearPos : string = "";

    get Tacho() : number { return this.tacho; }
    set Tacho(val : number)
    {
        this.tacho = val;
        this.tachoProgressBar.Value = val;
        this.tachoNeedleGauge.Value = val;
        this.tachoProgressBar.update();
        this.tachoNeedleGauge.update();
    }
    get Speed() { return this.speed; }
    set Speed(val : number)
    {
        this.speed = val;
        this.speedNeedleGauge.Value = val;
        this.speedNeedleGauge.update();
        this.speedLabel.text = val.toFixed(0);
    }
    get Boost() { return this.boost; }
    set Boost(val : number)
    {
        this.boost = val;
        this.boostNeedleGauge.Value = val;
        this.boostNeedleGauge.update();
    }

    get WaterTemp() { return this.waterTemp; }
    set WaterTemp(val : number)
    {
        this.waterTemp = val;
        this.waterTempProgressBar.Value = val;
        this.waterTempProgressBar.update();
    }

    get GasMilage() { return this.gasMilage; }
    set GasMilage(val : number)
    {
        this.gasMilage = val;
        this.gasMilageLabel.text = val.toFixed(2);
    }
    get Trip() { return this.trip }
    set Trip(val : number)
    {
        this.trip = val;
        this.tripLabel.text = val.toFixed(1);
    }
    get Fuel() { return this.fuel }
    set Fuel(val : number)
    {
        this.fuel = val;
        this.fuelLabel.text = val.toFixed(2);
    }

    get GearPos() { return this.gearPos }
    set GearPos(val : string)
    {
        this.gearPos = val;
        this.gearPosLabel.text = val;
    }

    static get RequestedTexturePath() : string[]
    {
        return ["img/AnalogMeterClusterTexture.json", "img/AnalogMeterFont_115px.fnt",  "img/AnalogMeterFont_45px.fnt", "img/AnalogMeterFont_40px.fnt", "img/AnalogMeterFont_60px.fnt"];
    }

    static get RequestedFontFamily() : string[]
    {
        return ["DSEG14ClassicItalic"]
    }

    static get RequestedFontCSSURL() : string[]
    {
        return ['font.css'];
    }

    constructor()
    {
        super();
        const TachoMeter: PIXI.Container = this.createTachoMeter();
        const SpeedMeter: PIXI.Container = this.createSpeedMeter();
        const BoostMeter: PIXI.Container = this.createBoostMeter();
        TachoMeter.position.set(345,0);
        BoostMeter.position.set(615,80);

        super.addChild(SpeedMeter);
        super.addChild(BoostMeter);
        super.addChild(TachoMeter);            
    }

    private createTachoMeter(): PIXI.Container
    {
        const tachoMax = 9000;
        const tachoMin = 0;
        const tachoValDefalut = 4500;

        const tachoContainer = new PIXI.Container();
        const backSprite = PIXI.Sprite.fromFrame("AnalogTachoMeter_Base");
        tachoContainer.addChild(backSprite);

        const tachoProgressBar = this.tachoProgressBar;
        tachoProgressBar.Texture = PIXI.Texture.fromFrame("AnalogTachoMeter_Bar");
        tachoProgressBar.OffsetAngle = 90;
        tachoProgressBar.FullAngle = 270;
        tachoProgressBar.Max = tachoMax;
        tachoProgressBar.Min = tachoMin;
        tachoProgressBar.Value = tachoValDefalut;
        tachoProgressBar.Radius = 193;
        tachoProgressBar.InnerRadius = 160;
        tachoProgressBar.Center.set(193,193);
        tachoProgressBar.pivot.set(193, 193);
        tachoProgressBar.position.set(300,300);
        tachoContainer.addChild(tachoProgressBar);
        tachoProgressBar.updateForce();

        const tachoMeter = this.tachoNeedleGauge;
        tachoMeter.Texture = PIXI.Texture.fromFrame("AnalogTachoMeter_Needle");
        tachoMeter.Max = tachoMax;
        tachoMeter.Min = tachoMin;
        tachoMeter.Value = tachoValDefalut;
        tachoMeter.OffsetAngle = 90;
        tachoMeter.FullAngle = 270;
        tachoMeter.pivot.set(15,15);
        tachoMeter.position.set(300,300);
        tachoContainer.addChild(tachoMeter);
        tachoMeter.updateForce();

        const shaftSprite = PIXI.Sprite.fromFrame("AnalogTachoMeter_NeedleCap");
        shaftSprite.pivot.set(72,72);
        shaftSprite.position.set(300,300);
        tachoContainer.addChild(shaftSprite);

        const gasMilageLabel = this.gasMilageLabel = new PIXI.extras.BitmapText("12.00", {font : "DSEG14_Classic_45px", align : "right"});
        gasMilageLabel.anchor = new PIXI.Point(1,0.5);
        gasMilageLabel.position.set(495,335);
        gasMilageLabel.scale.set(0.9);
        tachoContainer.addChild(gasMilageLabel);

        const tripLabel = this.tripLabel = new PIXI.extras.BitmapText("125.0", {font : "DSEG14_Classic_40px", align : "right"});
        tripLabel.anchor = new PIXI.Point(1,0.5);
        tripLabel.position = new PIXI.Point(505,378);
        tripLabel.text = "125.0";
        tripLabel.scale.set(0.9);
        tachoContainer.addChild(tripLabel);

        const fuelLabel = this.fuelLabel = new PIXI.extras.BitmapText("25.00", {font : "DSEG14_Classic_40px", align : "right"});
        fuelLabel.anchor = new PIXI.Point(1,0.5);
        fuelLabel.position = new PIXI.Point(505,420);
        fuelLabel.text = "25.00";
        fuelLabel.scale.set(0.9);
        tachoContainer.addChild(fuelLabel);

        const gearPosLabel = this.gearPosLabel = new PIXI.extras.BitmapText("6", {font : "DSEG14_Classic_115px", align : "center"});
        gearPosLabel.anchor = new PIXI.Point(0.5,0.5);
        gearPosLabel.position = new PIXI.Point(358,493);
        gearPosLabel.text = "6";
        gearPosLabel.scale.set(0.9);
        tachoContainer.addChild(gearPosLabel);

        return tachoContainer;
    }

    private createSpeedMeter(): PIXI.Container
    {
        const speedMax = 280;
        const speedMin = 0;
        const speedValDefault = 90;
        const waterTempMax = 140;
        const waterTempMin = 60;
        const waterTempValDefault = 90;

        const speedMeterContainer = new PIXI.Container();            

        const backSprite = PIXI.Sprite.fromFrame("AnalogSpeedMeter_Base");
        speedMeterContainer.addChild(backSprite);

        const speedLabel = this.speedLabel = new PIXI.extras.BitmapText(speedValDefault.toFixed(0), {font : "DSEG14_Classic_60px", align : "center"});
        speedLabel.anchor = new PIXI.Point(1,0.5);
        speedLabel.position.set(355,407);
        speedLabel.scale.set(0.9);
        speedMeterContainer.addChild(speedLabel);

        const waterTempProgressBar = this.waterTempProgressBar;
        waterTempProgressBar.Texture = PIXI.Texture.fromFrame("AnalogSpeedMeter_Bar");
        waterTempProgressBar.Max = waterTempMax;
        waterTempProgressBar.Min = waterTempMin;
        waterTempProgressBar.Value = waterTempValDefault;
        waterTempProgressBar.Radius = 162;
        waterTempProgressBar.InnerRadius = 120;
        waterTempProgressBar.OffsetAngle = 165;
        waterTempProgressBar.FullAngle = 120;
        waterTempProgressBar.Center.set(162,162);
        waterTempProgressBar.pivot.set(162,162);
        waterTempProgressBar.position.set(300,300);
        waterTempProgressBar.updateForce();
        speedMeterContainer.addChild(waterTempProgressBar);

        const speedNeedleGauge = this.speedNeedleGauge;
        speedNeedleGauge.Texture = PIXI.Texture.fromFrame("AnalogSpeedMeter_Needle");
        speedNeedleGauge.Max = speedMax;
        speedNeedleGauge.Min = speedMin;
        speedNeedleGauge.Value = speedValDefault;
        speedNeedleGauge.OffsetAngle = 75;
        speedNeedleGauge.FullAngle = 210;
        speedNeedleGauge.pivot.set(15,15);
        speedNeedleGauge.position.set(300,300);
        speedMeterContainer.addChild(speedNeedleGauge);
        speedNeedleGauge.updateForce();

        const shaftSprite = PIXI.Sprite.fromFrame("AnalogSpeedMeter_NeedleCap");
        shaftSprite.anchor.set(0.5,0.5);
        shaftSprite.position.set(300,300);
        speedMeterContainer.addChild(shaftSprite);

        return speedMeterContainer;
    }

    private createBoostMeter() : PIXI.Container
    {
        const boostMax = 2.0;
        const boostMin = -1.0;
        const boostValDefault = 0.0;

        const boostMeterContainer = new PIXI.Container();

        const backSprite = PIXI.Sprite.fromFrame("BoostMeter_Base");
        boostMeterContainer.addChild(backSprite);

        const boostNeedleGauge = this.boostNeedleGauge;
        boostNeedleGauge.Texture = PIXI.Texture.fromFrame("BoostMeter_Needle");
        boostNeedleGauge.OffsetAngle = 30;
        boostNeedleGauge.FullAngle = 90;
        boostNeedleGauge.AntiClockwise = true;
        boostNeedleGauge.Max = boostMax;
        boostNeedleGauge.Min = boostMin;
        boostNeedleGauge.Value = boostValDefault;
        boostNeedleGauge.pivot.set(90,15);
        boostNeedleGauge.position.set(220,220);
        boostNeedleGauge.updateForce();
        boostMeterContainer.addChild(boostNeedleGauge);

        return boostMeterContainer;
    }
}