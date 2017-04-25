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

module webSocketGauge.parts.CircularGaugePanel
{
    import CircularProgressBar = webSocketGauge.lib.graphics.CircularProgressBar;
    
    export class TextOption
    {
        public position = new PIXI.Point(0, 0);
        public anchor = new PIXI.Point(0, 0);
        public align : string = "left";
        public fontSize : number = 12;
        public letterSpacing : number = 0;
        constructor(position?: PIXI.Point, anchor? :  PIXI.Point, align? : string, fontsize? : number, letterSpacing? : number)
        {
            if(typeof(align) !== "undefined")
                this.align = align;
            if (typeof (fontsize) !== "undefined")
                this.fontSize = fontsize;
            if (typeof (letterSpacing) !== "undefined")
                this.letterSpacing = letterSpacing;
            if (position instanceof PIXI.Point)
                this.position = position;
            if (anchor instanceof PIXI.Point)
                this.anchor = anchor;
        }
        
        clone() : TextOption
        {
            const returnObj = new TextOption();
            returnObj.position = this.position.clone();
            returnObj.anchor = this.anchor.clone();
            returnObj.align = this.align;
            returnObj.fontSize = this.fontSize;
            returnObj.letterSpacing = this.letterSpacing;
            
            return returnObj;            
        }
    }
    
    export abstract class CircularGaugePanelBase extends PIXI.Container
    {
        private valueProgressBar: CircularProgressBar;
        protected valueTextLabel: PIXI.Text;
        protected masterTextStyle : PIXI.TextStyle;
        
        protected offsetAngle : number;
        protected fullAngle : number;
        protected min : number;
        protected max : number;
        protected invertDraw : boolean;
        protected antiClockWise : boolean;
        protected angleStep : number;
        protected valueBarRadius : number;
        protected valueBarInnerRadius : number;        
        protected valueLabelOption = new TextOption();
        
        protected titleLabel : string;
        protected titleLabelOption : TextOption;
        protected unitLabel : string;
        protected unitLabelOption: TextOption;
        
        protected axisLabel: string[] = new Array();
        protected axisLabelOption: TextOption[] = new Array();

        protected valueNumberRoundDigit : number = 1;
        
        protected redZoneBarEnable : boolean;
        protected yellowZoneBarEnable : boolean;
        protected greenZoneBarEnable : boolean;
                
        protected redZoneBarOffsetAngle : number;
        protected yellowZoneBarOffsetAngle : number;
        protected greenZoneBarOffsetAngle : number;
        protected redZoneBarFullAngle : number;
        protected yellowZoneBarFullAngle : number;
        protected greenZoneBarFullAngle : number;
        protected zoneBarRadius : number;
        
        protected centerPosition = new PIXI.Point();
        
        protected RedZoneBarTexture : PIXI.Texture;
        protected YellowZoneBarTexture : PIXI.Texture;
        protected GreenZoneBarTexture : PIXI.Texture;
        protected ValueBarTexture : PIXI.Texture;
        protected BackTexture : PIXI.Texture;
        protected GridTexture : PIXI.Texture;
               
        public get Value() : number { return this.valueProgressBar.Value};
        public set Value(value : number)
        {
            this.valueProgressBar.Value = value;
            this.valueProgressBar.update();
            
             if (value.toFixed(this.valueNumberRoundDigit).toString() !== this.valueTextLabel.text)
                this.valueTextLabel.text = value.toFixed(this.valueNumberRoundDigit).toString();
        }
        
        protected abstract setOption() : void;
        
        constructor()
        {
            super();
            this.setOption();
            this.createBackContainer();
            this.createValueProgressBar();
        }
        
        private createValueProgressBar() : void
        {            
            this.valueProgressBar = new CircularProgressBar();
            this.valueProgressBar.OffsetAngle = this.offsetAngle;
            this.valueProgressBar.FullAngle = this.fullAngle;
            this.valueProgressBar.Min = this.min;
            this.valueProgressBar.Max = this.max;
            this.valueProgressBar.AngleStep = this.angleStep;
            this.valueProgressBar.InvertDraw = this.invertDraw;
            this.valueProgressBar.AntiClockwise = this.antiClockWise;
            
            this.valueProgressBar.Center = this.centerPosition;
            this.valueProgressBar.Radius = this.valueBarRadius;
            this.valueProgressBar.InnerRadius = this.valueBarInnerRadius;
            
            this.valueProgressBar.Texture = this.ValueBarTexture;
            super.addChild(this.valueProgressBar);
           
            this.valueTextLabel = new PIXI.Text(this.min.toFixed(this.valueNumberRoundDigit).toString());
            this.valueTextLabel.style = this.masterTextStyle.clone();
            const valueLabelOption = this.valueLabelOption;
            this.valueTextLabel.style.fontSize = valueLabelOption.fontSize;
            this.valueTextLabel.position = valueLabelOption.position;
            this.valueTextLabel.anchor.set(valueLabelOption.anchor.x, valueLabelOption.anchor.y);
            this.valueTextLabel.style.align = valueLabelOption.align;
            this.valueTextLabel.style.letterSpacing = valueLabelOption.letterSpacing;
            super.addChild(this.valueTextLabel);            
        }
        
        protected setAxisLabel(axisLabel : string[]) : void
        {
            this.axisLabel = new Array();
            for (let i = 0; i < axisLabel.length; i++)
                this.axisLabel.push(axisLabel[i]);
        }
        protected setAxisLabelOption(axisLabelOption : TextOption[]) : void
        {
            this.axisLabelOption = new Array(); 
            for (let i = 0; i < axisLabelOption.length; i++)
                this.axisLabelOption.push(axisLabelOption[i]);
        }
        
        private createBackContainer(): void
        {   
            const backContainer = new PIXI.Container();
            //Unlock baked texture
            backContainer.cacheAsBitmap = false;
            
            const centerPosition = this.centerPosition;
            const zoneBarRadius = this.zoneBarRadius;
            
            //Add backSprite
            const backTexture = this.BackTexture;
            const backSprite = new PIXI.Sprite();
            backSprite.texture = backTexture;
            backContainer.addChild(backSprite);
            
            //Add redzoneBar
            if (this.redZoneBarEnable)
            {
                const redZoneBarTexture = this.RedZoneBarTexture;
                const redzoneBar = new CircularProgressBar();
                redzoneBar.OffsetAngle = this.redZoneBarOffsetAngle;
                redzoneBar.FullAngle = this.redZoneBarFullAngle;
                redzoneBar.Texture = redZoneBarTexture;
                redzoneBar.Value = redzoneBar.Max;
                redzoneBar.Center = centerPosition;
                redzoneBar.Radius = zoneBarRadius;
                redzoneBar.InnerRadius = 0;
                redzoneBar.updateForce();
                backContainer.addChild(redzoneBar);
            }
            
            //Add yellowzoneBar
            if (this.yellowZoneBarEnable)
            {
                const yellowZoneBarTexture = this.YellowZoneBarTexture;
                const yellowzoneBar = new CircularProgressBar();
                yellowzoneBar.OffsetAngle = this.yellowZoneBarOffsetAngle;
                yellowzoneBar.FullAngle = this.yellowZoneBarFullAngle;
                yellowzoneBar.Texture = yellowZoneBarTexture;
                yellowzoneBar.Value = yellowzoneBar.Max;
                yellowzoneBar.Center = centerPosition;
                yellowzoneBar.Radius = zoneBarRadius;
                yellowzoneBar.InnerRadius = 0;
                yellowzoneBar.updateForce();
                backContainer.addChild(yellowzoneBar);
            }
            
            //Add greenZoneBar
            if (this.greenZoneBarEnable)
            {
                const greenZoneBarTexture = this.GreenZoneBarTexture;
                const greenzoneBar = new CircularProgressBar();
                greenzoneBar.OffsetAngle = this.greenZoneBarOffsetAngle;
                greenzoneBar.FullAngle = this.greenZoneBarFullAngle;
                greenzoneBar.Texture = greenZoneBarTexture;
                greenzoneBar.Value = greenzoneBar.Max;
                greenzoneBar.Center = centerPosition;
                greenzoneBar.Radius = zoneBarRadius;
                greenzoneBar.InnerRadius = 0;
                greenzoneBar.updateForce();
                backContainer.addChild(greenzoneBar);
            }
            
            //Add gridSprite
            const gridTexture = this.GridTexture;
            const gridSprite = new PIXI.Sprite();
            gridSprite.texture = gridTexture;
            backContainer.addChild(gridSprite);

            //Set Title and unit text
            const titleTextElem = new PIXI.Text(this.titleLabel);
            const titleTextOption = this.titleLabelOption;
            titleTextElem.style = this.masterTextStyle.clone();
            titleTextElem.style.fontSize = titleTextOption.fontSize;
            titleTextElem.style.align = titleTextOption.align;
            titleTextElem.anchor.set(titleTextOption.anchor.x, titleTextOption.anchor.y)
            titleTextElem.position.set(titleTextOption.position.x, titleTextOption.position.y);
            
            const unitTextElem = new PIXI.Text(this.unitLabel);
            const unitTextOption = this.unitLabelOption;
            unitTextElem.style = this.masterTextStyle.clone();
            unitTextElem.style.fontSize = unitTextOption.fontSize;
            unitTextElem.style.align = unitTextOption.align;
            unitTextElem.anchor.set(unitTextOption.anchor.x, unitTextOption.anchor.y);
            unitTextElem.position.set(unitTextOption.position.x, unitTextOption.position.y );
 
            backContainer.addChild(titleTextElem);
            backContainer.addChild(unitTextElem);
            
            //Set axis label
            for (let i = 0; i < this.axisLabelOption.length; i++)
            {
                const axisLabelOption = this.axisLabelOption[i];
                const axisLabelElem = new PIXI.Text(this.axisLabel[i]);
                axisLabelElem.style = this.masterTextStyle.clone();
                axisLabelElem.style.fontSize = axisLabelOption.fontSize;
                axisLabelElem.style.align = axisLabelOption.align;
                axisLabelElem.anchor.set(axisLabelOption.anchor.x, axisLabelOption.anchor.y);
                axisLabelElem.position.set(axisLabelOption.position.x, axisLabelOption.position.y);
                backContainer.addChild(axisLabelElem);
            }            
            this.addChild(backContainer);
            
            //Bake into texture
            backContainer.cacheAsBitmap = true;            
        }
    }
};

module webSocketGauge.parts.CircularGaugePanel.SemiCircularGaugePanel
{
    import CircularGaugePanelBase = webSocketGauge.parts.CircularGaugePanel.CircularGaugePanelBase;
    export class SemiCircularGaugePanel extends CircularGaugePanelBase
    {
        static get RequestedTexturePath() : string[]
        {
            return ["/parts/CirCularGauges/SemiCircularGaugeTexture.json"];
        }
        
        static get RequestedFontFamily() : string[]
        {
            return ["FreeSans-Bold"]
        }
        
        static get RequestedFontCSSURL() : string[]
        {
            return ['/parts/fonts/font.css'];
        }
        
        protected setOption() : void
        {
            this.RedZoneBarTexture = PIXI.Texture.fromFrame("SemiCircular_Gauge1_Redzone_Bar");
            this.YellowZoneBarTexture = PIXI.Texture.fromFrame("SemiCircular_Gauge1_Yellowzone_Bar");
            this.GreenZoneBarTexture = PIXI.Texture.fromFrame("SemiCircular_Gauge1_Greenzone_Bar");
            this.ValueBarTexture = PIXI.Texture.fromFrame("SemiCircular_Gauge1_Value_Bar");
            this.BackTexture = PIXI.Texture.fromFrame("SemiCircular_Gauge1_Back");
            this.GridTexture = PIXI.Texture.fromFrame("SemiCircular_Gauge1_Grid");
            
            this.masterTextStyle = new PIXI.TextStyle(
            {
                dropShadow : true,
                dropShadowBlur: 15,
                dropShadowColor: "white",
                dropShadowDistance: 0,
                fill : "white",
                fontFamily: "FreeSans-Bold"
            });
            this.offsetAngle = 180;
            this.fullAngle = 180;
            this.min = 0;
            this.max = 100;
            this.angleStep = 0.1;
            
            this.valueBarRadius = 200;
            this.valueBarInnerRadius = 0;        
            this.valueLabelOption.position.set(200,185);
            this.valueLabelOption.fontSize = 90;
            this.valueLabelOption.position.set(200,185);
            this.valueLabelOption.anchor.set(0.5,0.5);
            this.valueLabelOption.align = "center";
            this.valueLabelOption.letterSpacing = -3;
            
            this.zoneBarRadius = 200;        
            this.centerPosition.set(200,195);

            this.titleLabel = "THROTTLE";
            this.titleLabelOption = new TextOption(new PIXI.Point(200, 266), new PIXI.Point(0.5, 0.5), "center", 42);
            this.unitLabel = "%";
            this.unitLabelOption = new TextOption(new PIXI.Point(200, 235), new PIXI.Point(0.5, 0.5), "center", 23);
            this.valueNumberRoundDigit = 0;

            this.redZoneBarEnable = true;
            this.yellowZoneBarEnable = true;
            this.greenZoneBarEnable = true;
            this.redZoneBarOffsetAngle = 315;
            this.redZoneBarFullAngle = 45;
            this.yellowZoneBarOffsetAngle = 270;
            this.yellowZoneBarFullAngle = 45;
            this.greenZoneBarOffsetAngle = 180;
            this.greenZoneBarFullAngle = 45;

            const axisLabelFontSize = 38;
            this.setAxisLabel(
            [   "0",
                "25",
                "50",
                "75",
                "100",
            ]);
            this.setAxisLabelOption(
            [
                new TextOption(new PIXI.Point(60, 195), new PIXI.Point(0.5, 0), "center", axisLabelFontSize),
                new TextOption(new PIXI.Point(90, 75), new PIXI.Point(1, 0.5), "right", axisLabelFontSize),
                new TextOption(new PIXI.Point(200, 40), new PIXI.Point(0.5, 1), "center", axisLabelFontSize),
                new TextOption(new PIXI.Point(310, 75), new PIXI.Point(0, 0.5), "left", axisLabelFontSize),
                new TextOption(new PIXI.Point(340, 195), new PIXI.Point(0.5, 0), "center", axisLabelFontSize)                
            ]);
        }
    }
    
    export class ThrottleGaugePanel extends SemiCircularGaugePanel
    {
        protected setOption() : void
        {
            super.setOption();
            this.titleLabel = "THROTTLE";
            this.min = 0;
            this.max = 100;
            this.unitLabel = "%"
            this.redZoneBarEnable = false;
            this.yellowZoneBarEnable = false;
            this.greenZoneBarEnable = false;
            this.setAxisLabel(["0","25","50","75","100"]);
        }
    } 
}

module webSocketGauge.parts.CircularGaugePanel.FullCircularGaugePanel
{
    import CircularGaugePanelBase = webSocketGauge.parts.CircularGaugePanel.CircularGaugePanelBase;
    export class FullCircularGaugePanel extends CircularGaugePanelBase
    {
        static get RequestedTexturePath() : string[]
        {
            return ["/parts/CirCularGauges/FullCircularGaugeTexture.json"];
        }
        
        static get RequestedFontFamily() : string[]
        {
            return ["FreeSans-Bold"]
        }
        
        static get RequestedFontCSSURL() : string[]
        {
            return ['/parts/fonts/font.css'];
        }
        
        protected setOption() : void
        {            
            this.RedZoneBarTexture = PIXI.Texture.fromFrame("FullCircularGauge_RedZone_Bar");
            this.YellowZoneBarTexture = PIXI.Texture.fromFrame("FullCircularGauge_YellowZone_Bar");
            this.GreenZoneBarTexture = PIXI.Texture.fromFrame("FullCircularGauge_GreenZone_Bar");
            this.ValueBarTexture = PIXI.Texture.fromFrame("FullCircularGauge_ValueBar");
            this.BackTexture = PIXI.Texture.fromFrame("FullCircularGauge_Back");
            this.GridTexture = PIXI.Texture.fromFrame("FullCircularGauge_Grid");
            
            this.masterTextStyle = new PIXI.TextStyle(
            {
                dropShadow : true,
                dropShadowBlur: 10,
                dropShadowColor: "white",
                dropShadowDistance: 0,
                fill : "white",
                fontFamily: "FreeSans-Bold"
            });
            this.offsetAngle = 90;
            this.fullAngle = 270;
            this.min = -1.0;
            this.max = 2.0;
            this.angleStep = 0.1;
            
            this.valueBarRadius = 150;
            this.valueBarInnerRadius = 50;        
            this.valueLabelOption.position.set(200,185);
            this.valueLabelOption.fontSize = 80;
            this.valueLabelOption.position.set(200,185);
            this.valueLabelOption.anchor.set(0.5,0.5);
            this.valueLabelOption.align = "center";
            this.valueLabelOption.letterSpacing = -3;
            
            this.zoneBarRadius = 200;        
            this.centerPosition.set(200,200);

            this.titleLabel = "TURBO BOOST";
            this.titleLabelOption = new TextOption(new PIXI.Point(200, 370), new PIXI.Point(0.5, 0.5), "center", 38);
            this.unitLabel = "x100kPa";
            this.unitLabelOption = new TextOption(new PIXI.Point(200, 235), new PIXI.Point(0.5, 0.5), "center", 23);
            this.valueNumberRoundDigit = 1;

            this.redZoneBarEnable = true;
            this.yellowZoneBarEnable = true;
            this.greenZoneBarEnable = true;
            this.redZoneBarOffsetAngle = 315;
            this.yellowZoneBarOffsetAngle = 270;
            this.greenZoneBarOffsetAngle = 90;
            this.redZoneBarFullAngle = 40;
            this.yellowZoneBarFullAngle = 45;
            this.greenZoneBarFullAngle = 90;

            const axisLabelFontSize = 30;
            this.setAxisLabel(
            [   "-1.0",
                "-0.5",
                "0",
                "+0.5",
                "+1.0",
                "+1.5",
                "+2.0"
            ]);
            this.setAxisLabelOption(
            [
                new TextOption(new PIXI.Point(207, 335), new PIXI.Point(0, 0.5), "left", axisLabelFontSize),
                new TextOption(new PIXI.Point(90, 310), new PIXI.Point(1, 0.5), "right", axisLabelFontSize),
                new TextOption(new PIXI.Point(45, 193), new PIXI.Point(1, 0.5), "right", axisLabelFontSize),
                new TextOption(new PIXI.Point(90, 75), new PIXI.Point(1, 0.5), "right", axisLabelFontSize),
                new TextOption(new PIXI.Point(200, 40), new PIXI.Point(0.5, 1), "center", axisLabelFontSize),
                new TextOption(new PIXI.Point(310, 75), new PIXI.Point(0, 0.5), "left", axisLabelFontSize),
                new TextOption(new PIXI.Point(340, 195), new PIXI.Point(0.5, 0), "center", axisLabelFontSize)                
            ]);
        }
    }
    
    export class BoostGaugePanel extends FullCircularGaugePanel
    {
        protected setOption() : void
        {
            super.setOption();
            this.titleLabel = "TURBO BOOST";
            this.min = -1.0;
            this.max = 2.0;
            this.setAxisLabel(
            [   "-1.0",
                "-0.5",
                "0",
                "+0.5",
                "+1.0",
                "+1.5",
                "+2.0"
            ]);
        }
    }
    
    export class AirFuelGaugePanel extends FullCircularGaugePanel
    {
        protected setOption() : void
        {
            super.setOption();
            this.titleLabel = "Air/Fuel Ratio";
            this.min = 8;
            this.max = 20;
            this.redZoneBarOffsetAngle = 315;
            this.redZoneBarFullAngle = 45;
            this.yellowZoneBarOffsetAngle = 225;
            this.yellowZoneBarFullAngle = 90;
            this.greenZoneBarOffsetAngle = 135;
            this.greenZoneBarFullAngle = 90;
            this.invertDraw = true;
            this.unitLabel="A/F";
            this.setAxisLabel(
            [   "20",
                "18",
                "16",
                "14",
                "12",
                "10",
                "8"
            ]);
        }
    }
}

