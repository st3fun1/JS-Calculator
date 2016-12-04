'use strict';
$(document).ready(function () {
    var Calculator = function () {
        this.evalString = undefined;
        this.equalPressed = false;
        this.lastOperation = undefined;
    };
    Calculator.prototype.findPercentages = function () {
        var regex = /(((\d+)(\.))?(\d+))%/g;
        this.evalString = this.evalString.replace(regex, "$1/100").replace(/\-\-/g, '+');
        return this.evalString;
    };
    Calculator.prototype.getSquare = function (str) {
        var regex = /(((\d+)(\.))?(\d+))$/g;
        return str.replace(regex, '$1*$1');
    };
    Calculator.prototype.getSquareRoot = function (str) {
        var regex = /(((\d+)(\.))?(\d+))?\^(((\d+)(\.))?(\d+))(?=[^\d])?/g;
        return str.replace(regex, function (match) {
            //remove ^
            var indexOfRad = match.indexOf('^');
            if (indexOfRad > 0) {
                return match.slice(0, indexOfRad) * Math.sqrt(parseFloat(match.slice(indexOfRad + 1)));
            }
            else return Math.sqrt(parseFloat(match.slice(indexOfRad + 1)));
        })
    };
    Calculator.prototype.clearLastEntry = function (el) {
        var el = $('.operations');
        var valOfOp = el.text();
        if(valOfOp == '0') return;
        if(this.equalPressed == true) {
            this.evalString = valOfOp.slice(0,valOfOp.length - 1);
        }
        else this.evalString = this.evalString.slice(0, this.evalString.length - 1);
        $('.operations').text(this.evalString);
    };
    Calculator.prototype.reset = function () {
        this.evalString = undefined;
        $('.result, .operations').text('0');
        this.equalPressed = false;
        return this.evalString;
    };
    Calculator.prototype.evaluate = function (str) {
        return new Function('return ' + str)();
    };
    Calculator.prototype.returnResult = function () {
        try {
            this.findPercentages();
            this.evalString = this.getSquareRoot(this.evalString);
            let result = this.evaluate(this.evalString);
            $('.result').text(result);
            this.evalString = result;
            $('.operations').text(this.evalString);
            this.equalPressed = true;
        }
        catch (err) {
            $('.result').text('ERROR!');
        }
    };
    Calculator.prototype.pressButtons = function (button) {
        var that = this;
        $(button).on('click', function () {
            var btnVal = $(this).attr('value');
            if (/[0-9]|[.+-/*%()^]/.test(btnVal)) {
                
                if (that.evalString == undefined) that.evalString = btnVal;
                else that.evalString = that.evalString + btnVal;
                console.log('evalString', that.evalString);
            }
            else {
                if (btnVal == '=') {
                    return that.returnResult();
                }
                else if (btnVal == 'AC') {
                    return that.reset();
                }
                else if (btnVal == 'CE') {
                    return that.clearLastEntry();
                }
                else if (btnVal == 'pow') {
                    that.evalString = that.getSquare(that.evalString);
                }
            }
            
            that.lastOperation = that.codeToHtmlEntity(that.evalString,/\^/g,'&radic;');
            that.codeToHtmlEntity(that.lastOperation,/\//g,'&divide;');
        });
    };
    Calculator.prototype.codeToHtmlEntity = function(str,regex,entity) {
        var newStr = str.replace(regex,entity);
        console.log(str);
        $('.operations').empty().append(newStr);
        return newStr;
    };
    
    Calculator.prototype.init = function (button) {
        this.pressButtons(button);
    };
    new Calculator().init('.custom-btn');
});