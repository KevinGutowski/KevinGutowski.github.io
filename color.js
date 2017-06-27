function normHSV(color) {
    color = {
        h: color.h / 360.0,
        s: color.s / 100.0,
        v: color.v / 100.0,
    }

    return color
}

function normRGB(color) {
    color = {
        r: color.r / 255.0,
        g: color.g / 255.0,
        b: color.b / 255.0
    }

    return color
}

function HSVtoRGB(color) {
    var h,s,v,i,f,p,q,t
    h = color.h;
    s = color.s;
    v = color.v;

    i = math.floor(h * 6);
    f = (h * 6) - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);

    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }

    color = {
        r: r,
        g: g,
        b: b
    }

    return color
}

function RGBtoHSV(color) {
    var r = color.r;
    var g = color.g;
    var b = color.b;

    var max = Math.max(r,g,b);
    var min = Math.min(r,g,b);
    var h, s, v = max;
    var d = max - min;
    s = max == 0 ? 0 : d / max;

    if (max == min) {
        h = 0;
    } else {
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }

        h /= 6
    }

    var tempHSVColor = {
        h: h,
        s: s,
        v: v
    }

    return tempHSVColor;

}

function getColorContrast(color1, color2) {
    if (color1.r > 1 || color1.g > 1 || color1.b > 1) {
        return "ERROR: Color1 out of range."
    }

    if (color2.r > 1 || color2.g > 1 || color2.b > 1) {
        return "ERROR: Color2 out of range."
    }
    // Color 1
    // Get Red Value of Color 1

    var L1R = color1.r;

    if (L1R <= 0.03928) {
        L1R = L1R / 12.92;
    } else {
        L1R = ((L1R + 0.055) / 1.055)**2.4;
    }

    // Get Green Value of Color 1

    var L1G = color1.g;

    if (L1G <= 0.03928) {
        L1G = L1G / 12.92;
    } else {
        L1G = ((L1G + 0.055) / 1.055)**2.4;
    }

    // Get Blue Value of Color 1

    var L1B = color1.b;

    if (L1B <= 0.03928) {
        L1B = L1B / 12.92;
    } else {
        L1B = ((L1B + 0.055) / 1.055)**2.4;
    }

    //Color2
    //Get Red Value of Color 2

    var L2R = color2.r;

    if (L2R <= 0.03928) {
        L2R = L2R / 12.92;
    } else {
        L2R = ((L2R + 0.055) / 1.055)**2.4;
    }

    //Get Green Value of Color 2

    var L2G = color2.g;

    if (L2G <= 0.03928) {
        L2G = L2G / 12.92;
    } else {
        L2G = ((L2G + 0.055) / 1.055)**2.4;
    }

    //Get Blue Value of Color 2

    var L2B = color2.b;

    if (L2B <= 0.03928) {
        L2B = L2B / 12.92;
    } else {
        L2B = ((L2B + 0.055) / 1.055)**2.4;
    }

    var L1 = 0.2126 * L1R + 0.7152 * L1G + 0.0722 * L1B;
    var L2 = 0.2126 * L2R + 0.7152 * L2G + 0.0722 * L2B;

    //Make sure L1 is lighter
    if (L1 <= L2) {
        var temp = L2;
        L2 = L1;
        L1 = temp;
    }

    //Calculate Contrast
    cr = (L1 + 0.05) / (L2 + 0.05);

    return cr
}

function getColorContrastHSV(color1, color2) {
    //normalize HSV colors
    color1 = normHSV(color1);
    color2 = normHSV(color2);

    //convert to RGB
    color1 = HSVtoRGB(color1);
    color2 = HSVtoRGB(color2);

    //get contrast of RGB colors
    return getColorContrast(color1, color2)
}

function hexToRgb(hex){
    hex = hex.replace('#','');
    var myTempRGBColor = {
        r: parseInt(hex.substring(0,2), 16),
        g: parseInt(hex.substring(2,4), 16),
        b: parseInt(hex.substring(4,6), 16)
    }

    return myTempRGBColor
}
