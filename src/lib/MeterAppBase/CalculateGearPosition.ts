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
 
export function calculateGearPosition(rev : number, speed : number, neutralSw : boolean) : string
{
    if (neutralSw)
        return "N";

    //Avoid divide by zero (on vehicle stop)
    if (speed <= 0)
        return "-";

    var gear_ratio = 1 / 3.9 * rev * 60 * 0.001992 / speed;

    if (gear_ratio > 4.27)
        return "-";
    else if (gear_ratio > 3.01)
        return "1";
    else if (gear_ratio > 2.07)
        return "2";
    else if (gear_ratio > 1.55)
        return "3";
    else if (gear_ratio > 1.2)
        return "4";
    else if (gear_ratio > 0.95)
        return "5";
    else if (gear_ratio > 0.73)
        return "6";
    else
        return "-";  
}

