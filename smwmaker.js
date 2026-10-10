"use strict";
const layer1DatasTable = 0x05E000;
const layer2DatasTable = 0x05E600;
const spriteDataTable = 0x05EC00;
const spriteGfxTable = 0x00A8C3;
const tilesetList = [0, 1, 2, 3, 4, 4, 2, 0, 2, 3, 3, 3, 0, 4, 3];
const layer2List = { 0: 0, 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 1, 8: 1, 9: 0,
    0x0A: 0, 0x0B: 0, 0x0C: 0, 0x0D: 0, 0x0E: 0, 0x0F: 1, 0x10: 0, 0x11: 0, 0x12: 1,
    0x13: 1, 0x14: 1, 0x15: 1, 0x16: 1, 0x17: 1, 0x18: 1, 0x19: 1, 0x1A: 1, 0x1B: 1,
    0x1C: 1, 0x1D: 1, 0x1E: 0, 0x1F: 1 };
const verticalList = {
    0: 0, 1: 0, 2: 0, 3: 1, 4: 1, 5: 0, 6: 0, 7: 1, 8: 1, 9: 0, 0x0A: 1, 0x0B: 0, 0x0C: 0, 0x0D: 1,
    0x0E: 0, 0x0F: 0, 0x10: 0, 0x11: 0, 0x12: 0, 0x13: 0, 0x14: 0, 0x15: 0, 0x16: 0, 0x17: 0, 0x18: 0,
    0x19: 0, 0x1A: 0, 0x1B: 0, 0x1C: 0, 0x1D: 0, 0x1E: 0, 0x1F: 0
};
const defaultBGList = [0x0CD900, 0x0CDAB9, 0x0CDC71, 0x0CDD44, 0x0CDE54,
    0x0CDF59, 0x0CE103, 0x0CE472, 0x0CE674, 0x0CE684, 0x0CE7C0, 0x0CE8EE,
    0x0CE8FE, 0x0CEC82, 0x0CEF80, 0x0CF175, 0x0CF45A];
class TilePart {
    gfx = 0;
    xflip = 0;
    yflip = 0;
    prior = 0;
    pal = 0;
}
class Tile {
    upleft;
    upright;
    lowleft;
    lowright;
    actsLike = 0x130;
    constructor() {
        this.upleft = new TilePart();
        this.upright = new TilePart();
        this.lowleft = new TilePart();
        this.lowright = new TilePart();
    }
}
class RGB {
    r = 0;
    g = 0;
    b = 0;
}
class Obj {
    objNum = 0;
    x = 0;
    y = 0;
    settings = 0;
    screen = 0;
    tileNum = -1;
    tileWidth = 0;
    tileHeight = 0;
    extA = 0;
    extB = 0;
    mode = 0;
    submode = 0;
    height16 = 0;
    width16 = 0;
    conditionalDirectMap16FlagToUse = 0;
    conditionalDirectMap16UseAddition = 0;
    constructor(objNum, x, y, settings) {
        this.objNum = objNum;
        this.x = x;
        this.y = y;
        this.settings = settings;
    }
}
class ExAni {
    used = 0;
    type = 0;
    trigger = 0;
    frames = 0;
    vramDest = 0;
    numColor = 0;
    palDest = 0;
    useLevelsAlterGFX = 0;
    frameData = [];
}
class Sprite {
    xPosition = 0;
    yPosition = 0;
    spriteID = 0;
    extra = 0;
    screenNum = 0;
}
class Exit {
    scrNumber = 0;
    isSecond = 0;
    destLevel = 0;
    isWaterMid = 0;
    LMflag = 0;
}
class SecondExit {
    dest = 0;
    bg = 0;
    fg = 0;
    x = 0;
    y = 0;
    scrNum = 0;
    action = 0;
    modified = false;
    water = 0;
    enterLeft = 0;
    relative = 0;
    exitToOW = 0;
    offset = 0;
    slippery = 0;
    method2 = 0;
    useDiffEvent = 0;
    useTeleport = 0;
    owAction = 0;
    location = 0;
    event = 0;
}
let layer1Data, layer2Data;
let exits;
let sprites;
let bgColor;
let bgData;
let map16, bgTiles;
let fg1bmp, fg2bmp, bgbmp, fg3bmp;
let bg2bmp, bg3bmp;
let sp1bmp, sp2bmp, sp3bmp, sp4bmp;
let orgFg1bmp, orgFg2bmp, orgBgbmp, orgFg3bmp;
let orgBg2bmp, orgBg3bmp;
let orgSp1bmp, orgSp2bmp, orgSp3bmp, orgSp4bmp;
let fileData;
let fileName;
let levelNum;
let layer1DataPointer;
let layer2DataPointer;
let spriteDataPointer;
let tileset;
let fgbgGFX, sprGFX;
let fg1, fg2, bg, fg3;
let sp1, sp2, sp3, sp4;
let isLMModified;
let bgPage;
let bgPalNum, fgPalNum, spPalNum;
let pal;
let editMode;
let isVertical;
let timer;
let music;
let itemMemory;
let layer3Prior;
let verticalScrollSetting;
let buoyancy, buoyancy2;
let sprMemory;
let layer2ScrollSetting;
let layer3Setting;
let verticalLevelPositioning;
let verticalLevelUnknown;
let disableNoYoshi;
let enterScrNum, midScrNum;
let enterAction;
let enterX, enterY;
let enterFG, enterBG;
let levelMode;
let screenLength;
let backAreaColorNum;
let bgPointer;
let isLayer2;
let secondExits;
let isBGEdited;
let lmVer;
let romType;
let bypassedMusic;
let isTimeBypassed;
let hundreds;
let tens;
let ones;
let resetTheTime;
let sprGFXindex;
let fgbgGFXindex;
let customPaletteAddr;
let useNewSpriteSystem;
let anibmp, ani2bmp;
let mariobmp;
let is4bpp;
let bg2, bg3;
let superGFXBypass;
let disableOrgLevelPalAni;
let disableOrgLevelAni;
let disableCustomGlobalAni;
let disableCustomLevelAni;
let levelAnis;
let globalAnis;
let ani2;
let offset;
let slippery;
let water;
let method2;
let smartSpawnFlag;
let spriteSpawnRange;
let autoSetScrNumber;
let useSeparatelayer2ScrollRate;
let layer2VerticalScrollSetting;
let bgRelativeToFG;
let bgfgIsRelativeToPlayer;
let enterLeft;
let bgHeight;
let separateMidway;
let midOffset;
let midSlippery;
let midWater;
let midMethod2;
let midSmartSpawnFlag;
let midSpriteSpawnRange;
let midAutoSetScrNumber;
let midUseSeparatelayer2ScrollRate;
let midLayer2VerticalScrollSetting;
let midBgRelativeToFG;
let midBgfgIsRelativeToPlayer;
let midEnterLeft;
let midBgHeight;
let midMidScrNum;
let midwayX;
let midwayY;
let midAction;
let midwayFG;
let midwayBG;
let midwayRedirect;
let midwayRedirectLevelNum;
let horizontalLevelMode;
let showBottomRowOfTheLevel;
let levelUsesEitherLayer2OrLayer3;
let btnOpen;
let btnPalette;
let btn8x8;
let btn16x16;
let btnLevelToImage;
let btnLevelHeader;
let btnGFX;
let btnSprHeader;
let btnOtherHeader;
let btnEnter;
let btnSwitchBG;
let btnBGCancel;
let btnBGOK;
let btnEnterOK;
let btnEnterCancel;
let btnSprHeaderOK;
let btnSprHeaderCancel;
let selBG;
let btnOtherHeaderOK;
let btnOtherHeaderCancel;
let btnPaletteOK;
let btnPaletteCancel;
let selBackColor;
let selFGColor;
let selBGColor;
let selSprColor;
let btnGFXOK;
let btnGFXCancel;
let main;
let btnHeaderOK;
let btnHeaderCancel;
let btnExit;
let selScrNumber;
let btnExitOK;
let btnExitCancel;
let btnExitDelete;
let btn2ndExit;
let sel2ndEnter;
let btn2ndOK;
let btn2ndCancel;
let btnSave;
let prevObjLeft, prevObjTop;
let isPress;
let prevPosX, prevPosY;
let target;
function make_layer_data(layerData, layerDataBinary) {
    let currentScreen = 0;
    for (let i = 0; i < layerData.length; i++) {
        const obj = layerData[i];
        let newScreenFlag = 0;
        if (obj.screen == currentScreen) {
            newScreenFlag = 0;
        }
        else if (obj.screen == currentScreen + 1) {
            newScreenFlag = 1;
            currentScreen++;
        }
        else if (obj.screen > currentScreen + 1) {
            newScreenFlag = 0;
            layerDataBinary[layerDataBinary.length] = obj.screen & 0b11111;
            layerDataBinary[layerDataBinary.length] = 0;
            layerDataBinary[layerDataBinary.length] = 1;
            currentScreen = obj.screen;
        }
        else if (obj.screen < currentScreen) {
            newScreenFlag = 0;
            layerDataBinary[layerDataBinary.length] = obj.screen & 0b11111;
            layerDataBinary[layerDataBinary.length] = 0;
            layerDataBinary[layerDataBinary.length] = 1;
            currentScreen = obj.screen;
        }
        const objNum = obj.objNum;
        const settings = obj.settings;
        if (objNum === 0 && settings < 0x10) {
            throw new Error("Not valid Extended Object.");
        }
        else if (0x21 < objNum && objNum < 0x30) {
            throw new Error("Not valid Special Object.");
        }
        else {
            layerDataBinary[layerDataBinary.length] = (newScreenFlag << 7) | (((obj.objNum >>> 4) & 0b11) << 5) | (obj.y & 0b11111);
            layerDataBinary[layerDataBinary.length] = ((obj.objNum & 0b1111) << 4) | (obj.x & 0b1111);
            layerDataBinary[layerDataBinary.length] = obj.settings & 0xFF;
        }
    }
}
function delete_data(pointer) {
    if (snes2pc(pointer) - 8 >= 0x80200 &&
        String.fromCharCode(fileData[snes2pc(pointer) - 8], fileData[snes2pc(pointer) - 7], fileData[snes2pc(pointer) - 6], fileData[snes2pc(pointer) - 5]) == "STAR") {
        let size = (fileData[snes2pc(pointer) - 3] << 8) | fileData[snes2pc(pointer) - 4];
        let invSize = (fileData[snes2pc(pointer) - 1] << 8) | fileData[snes2pc(pointer) - 2];
        if (((~size) & 0xFFFF) === (invSize & 0xFFFF)) {
            size++;
            fileData[snes2pc(pointer) - 8] = 0;
            fileData[snes2pc(pointer) - 7] = 0;
            fileData[snes2pc(pointer) - 6] = 0;
            fileData[snes2pc(pointer) - 5] = 0;
            fileData[snes2pc(pointer) - 4] = 0;
            fileData[snes2pc(pointer) - 3] = 0;
            fileData[snes2pc(pointer) - 2] = 0;
            fileData[snes2pc(pointer) - 1] = 0;
            for (let i = 0; i < size; i++) {
                fileData[snes2pc(pointer) + i] = 0;
            }
        }
    }
}
function write_data(layerDataBinary) {
    const free = getFreeSpace(layerDataBinary.length);
    if (free === 0) {
        throw new Error("Space is not enough.");
    }
    fileData[free + 0] = "S".charCodeAt(0);
    fileData[free + 1] = "T".charCodeAt(0);
    fileData[free + 2] = "A".charCodeAt(0);
    fileData[free + 3] = "R".charCodeAt(0);
    fileData[free + 4] = ((layerDataBinary.length - 1) >>> 0) & 0xFF;
    fileData[free + 5] = ((layerDataBinary.length - 1) >>> 8) & 0xFF;
    fileData[free + 6] = (~(fileData[free + 4])) & 0xFF;
    fileData[free + 7] = (~(fileData[free + 5])) & 0xFF;
    for (let i = 0; i < layerDataBinary.length; i++) {
        fileData[free + 8 + i] = layerDataBinary[i];
    }
    return pc2snes(free + 8);
}
function save() {
    let low, high, bank;
    let primaryLevelHeader = [0, 0, 0, 0, 0];
    let secondaryLevelHeader = [0, 0, 0, 0];
    let spriteHeader = 0;
    const oldFileData = fileData.slice();
    if (!isLMModified) {
        alert("Only Modified ROM by Lunar Magic is supported.");
        return;
    }
    // make headers    
    primaryLevelHeader[0] = ((bgPalNum & 0b111) << 5) | (screenLength & 0b11111);
    primaryLevelHeader[1] = ((backAreaColorNum & 0b111) << 5) | (levelMode & 0b11111);
    primaryLevelHeader[2] = ((((layer3Prior & 0b1) << 7) | ((music & 0b111) << 4)) | (sprGFX & 0b1111));
    primaryLevelHeader[3] = (((timer & 0b11) << 6) | ((spPalNum & 0b111) << 3)) | (fgPalNum & 0b111);
    primaryLevelHeader[4] = ((((itemMemory & 0b11) << 6) | ((verticalScrollSetting & 0b11) << 4)) | (fgbgGFX & 0b1111));
    spriteHeader = (((((buoyancy & 1) << 7) | ((buoyancy2 & 1) << 6)) | (0 << 5)) | (sprMemory & 0b11111));
    secondaryLevelHeader[0] = ((layer2ScrollSetting & 0b1111) << 4) | (enterY & 0b1111);
    secondaryLevelHeader[1] = (((layer3Setting & 0b11) << 6) | (enterAction & 0b111) << 3) | (enterX & 0b111);
    secondaryLevelHeader[2] = (((midScrNum & 0b1111) << 4) | ((enterFG & 0b11) << 2)) | (enterBG & 0b11);
    secondaryLevelHeader[3] = ((((disableNoYoshi & 1) << 7) | ((verticalLevelUnknown & 1) << 6)) | ((verticalLevelPositioning & 1) << 5)) | (enterScrNum & 0b11111);
    // get old level data pointer
    low = fileData[snes2pc(layer1DatasTable + (3 * levelNum) + 0)];
    high = fileData[snes2pc(layer1DatasTable + (3 * levelNum) + 1)];
    bank = fileData[snes2pc(layer1DatasTable + (3 * levelNum) + 2)];
    let oldLayer1DataPointer = (bank << 16) | (high << 8) | low;
    low = fileData[snes2pc(layer2DatasTable + (3 * levelNum) + 0)];
    high = fileData[snes2pc(layer2DatasTable + (3 * levelNum) + 1)];
    bank = fileData[snes2pc(layer2DatasTable + (3 * levelNum) + 2)];
    let oldLayer2DataPointer = (bank << 16) | (high << 8) | low;
    low = fileData[snes2pc(spriteDataTable + (2 * levelNum) + 0)];
    high = fileData[snes2pc(spriteDataTable + (2 * levelNum) + 1)];
    if (!isLMModified) {
        bank = 0x07;
    }
    else {
        bank = fileData[snes2pc(0x0EF100 + levelNum)];
    }
    let oldSpriteDataPointer = (bank << 16) | (high << 8) | low;
    // write header
    fileData[snes2pc(0x05F000 + levelNum)] = secondaryLevelHeader[0];
    fileData[snes2pc(0x05F200 + levelNum)] = secondaryLevelHeader[1];
    fileData[snes2pc(0x05F400 + levelNum)] = secondaryLevelHeader[2];
    fileData[snes2pc(0x05F600 + levelNum)] = secondaryLevelHeader[3];
    fileData[snes2pc(oldLayer1DataPointer + 0)] = primaryLevelHeader[0];
    fileData[snes2pc(oldLayer1DataPointer + 1)] = primaryLevelHeader[1];
    fileData[snes2pc(oldLayer1DataPointer + 2)] = primaryLevelHeader[2];
    fileData[snes2pc(oldLayer1DataPointer + 3)] = primaryLevelHeader[3];
    fileData[snes2pc(oldLayer1DataPointer + 4)] = primaryLevelHeader[4];
    fileData[snes2pc(oldSpriteDataPointer)] = spriteHeader;
    if (!isLayer2) {
        if (defaultBGList.indexOf(bgPointer) != -1) {
            low = (bgPointer >>> 0) & 0xFF;
            high = (bgPointer >>> 8) & 0xFF;
            bank = 0xFF;
            fileData[snes2pc(layer2DatasTable + (3 * levelNum) + 0)] = low;
            fileData[snes2pc(layer2DatasTable + (3 * levelNum) + 1)] = high;
            fileData[snes2pc(layer2DatasTable + (3 * levelNum) + 2)] = bank;
        }
    }
    // second exits
    for (let i = 0; i < secondExits.length; i++) {
        let exit = secondExits[i];
        if (exit.modified) {
            let header1, header2, header3, header4;
            header1 = exit.dest & 0b11111111;
            header2 = ((exit.bg & 0b11) << 6) | ((exit.fg & 0b11) << 4) | (exit.y & 0b1111);
            header3 = ((exit.x & 0b111) << 5) | exit.scrNum & 0b11111;
            header4 = (((exit.dest >>> 8) & 0b1) << 3) | (exit.action & 0b111);
            fileData[snes2pc(0x05F800 + i)] = header1;
            fileData[snes2pc(0x05FA00 + i)] = header2;
            fileData[snes2pc(0x05FC00 + i)] = header3;
            fileData[snes2pc(0x05FE00 + i)] = header4;
        }
    }
    // make layer1 data
    let layer1DataBinary = new Array();
    layer1DataBinary[0] = primaryLevelHeader[0];
    layer1DataBinary[1] = primaryLevelHeader[1];
    layer1DataBinary[2] = primaryLevelHeader[2];
    layer1DataBinary[3] = primaryLevelHeader[3];
    layer1DataBinary[4] = primaryLevelHeader[4];
    try {
        make_layer_data(layer1Data, layer1DataBinary);
    }
    catch (e) {
        alert(e.message + "");
        fileData = oldFileData;
        return;
    }
    // exits
    for (let i = 0; i < exits.length; i++) {
        let exit = exits[i];
        layer1DataBinary[layer1DataBinary.length] = exit.scrNumber & 0b11111;
        layer1DataBinary[layer1DataBinary.length] = ((exit.isWaterMid & 1) << 3) |
            ((exit.LMflag & 1) << 2) | ((exit.isSecond & 1) << 1) | ((exit.destLevel >>> 8) & 1);
        layer1DataBinary[layer1DataBinary.length] = 0;
        layer1DataBinary[layer1DataBinary.length] = exit.destLevel & 0xFF;
    }
    if (!isLMModified) {
        throw new Error();
    }
    layer1DataBinary[layer1DataBinary.length] = 0xFF;
    let bgDataBinary;
    // make layer2 data
    let layer2DataBinary = new Array();
    if (isLayer2) {
        layer2DataBinary[0] = 0;
        layer2DataBinary[1] = 0;
        layer2DataBinary[2] = 0;
        layer2DataBinary[3] = 0;
        layer2DataBinary[4] = 0;
        try {
            make_layer_data(layer2Data, layer2DataBinary);
        }
        catch (e) {
            alert(e.message + "");
            fileData = oldFileData;
            return;
        }
        layer2DataBinary[layer2DataBinary.length] = 0xFF;
    }
    else {
        let arr1, arr2, arr;
        arr1 = new Array();
        arr2 = new Array();
        for (let i = 0; i < bgData.length; i++) {
            if (Math.floor(i / 16) % 2 == 0) {
                arr1[arr1.length] = bgData[i];
            }
            else {
                arr2[arr2.length] = bgData[i];
            }
        }
        arr = arr1.concat(arr2);
        bgDataBinary = compress_rle1(arr);
        if (arrayCompare(arr, decompress_rle1(bgDataBinary)) != true) {
            throw new Error();
        }
    }
    // make sprite data
    let spriteDataBinary = new Array((sprites.length * 3) + 2);
    spriteDataBinary[0] = spriteHeader;
    for (let i = 0; i < sprites.length; i++) {
        let spr = sprites[i];
        spriteDataBinary[1 + (i * 3) + 2] = spr.spriteID & 0xFF;
        spriteDataBinary[1 + (i * 3) + 0] = ((spr.yPosition & 0b1111) << 4) | ((spr.extra & 0b11) << 2) |
            (((spr.screenNum >>> 4) & 0b1) << 1) | (((spr.yPosition >>> 4) & 0b1));
        spriteDataBinary[1 + (i * 3) + 1] = ((spr.xPosition & 0b1111) << 4) | (spr.screenNum & 0b1111);
    }
    spriteDataBinary[spriteDataBinary.length - 1] = 0xFF;
    // delete old data
    delete_data(oldSpriteDataPointer);
    delete_data(oldLayer1DataPointer);
    delete_data(oldLayer2DataPointer);
    // write sprite data
    let addr;
    try {
        addr = write_data(spriteDataBinary);
    }
    catch (e) {
        alert(e.message + "");
        fileData = oldFileData;
        return;
    }
    fileData[snes2pc(spriteDataTable + (2 * levelNum) + 0)] = ((addr >>> 0) & 0xFF);
    fileData[snes2pc(spriteDataTable + (2 * levelNum) + 1)] = ((addr >>> 8) & 0xFF);
    if (!isLMModified) {
        throw new TypeError();
    }
    else {
        fileData[snes2pc(0x0EF100 + levelNum)] = ((addr >>> 16) & 0xFF);
    }
    // write layer 1 data    
    try {
        addr = write_data(layer1DataBinary);
    }
    catch (e) {
        alert(e.message + "");
        fileData = oldFileData;
        return;
    }
    fileData[snes2pc(layer1DatasTable + (3 * levelNum) + 0)] = ((addr >>> 0) & 0xFF);
    fileData[snes2pc(layer1DatasTable + (3 * levelNum) + 1)] = ((addr >>> 8) & 0xFF);
    fileData[snes2pc(layer1DatasTable + (3 * levelNum) + 2)] = ((addr >>> 16) & 0xFF);
    if (isLayer2) {
        // write layer 2 data
        let addr;
        try {
            addr = write_data(layer2DataBinary);
        }
        catch (e) {
            alert(e.message + "");
            fileData = oldFileData;
            return;
        }
        fileData[snes2pc(layer2DatasTable + (3 * levelNum) + 0)] = ((addr >>> 0) & 0xFF);
        fileData[snes2pc(layer2DatasTable + (3 * levelNum) + 1)] = ((addr >>> 8) & 0xFF);
        fileData[snes2pc(layer2DatasTable + (3 * levelNum) + 2)] = ((addr >>> 16) & 0xFF);
    }
    else {
        // write background data
        let free;
        if (defaultBGList.indexOf(bgPointer) === -1) {
            let addr;
            try {
                addr = write_data(bgDataBinary);
            }
            catch (e) {
                alert(e.message + "");
                fileData = oldFileData;
                return;
            }
            fileData[snes2pc(layer2DatasTable + (3 * levelNum) + 0)] = ((addr >>> 0) & 0xFF);
            fileData[snes2pc(layer2DatasTable + (3 * levelNum) + 1)] = ((addr >>> 8) & 0xFF);
            fileData[snes2pc(layer2DatasTable + (3 * levelNum) + 2)] = ((addr >>> 16) & 0xFF);
        }
    }
    if (!isLMModified) {
        throw new Error();
    }
    else {
        let bgfg = (isLayer2 ? 0 : 1);
        let flag = 0;
        fileData[snes2pc(0x0EF310 + levelNum)] = (((bgfg) & 0b1) << 1) | ((flag & 0b1) << 2) | ((bgPage & 0b1111) << 4);
    }
}
function getFreeSpace(dataSize) {
    let romData = stripHeader(fileData);
    let counter = 0;
    for (let i = 0x80000; i < romData.length; i++) {
        if (i < romData.length - 7 &&
            String.fromCharCode(romData[i], romData[i + 1], romData[i + 2], romData[i + 3]) == "STAR") {
            let size = (romData[i + 5] << 8) | romData[i + 4];
            let invSize = (romData[i + 7] << 8) | romData[i + 6];
            if (((~size) & 0xFFFF) === (invSize & 0xFFFF)) {
                counter = 0;
                i += size + 8;
                continue;
            }
        }
        counter++;
        if (counter === dataSize + 12) {
            if (intdiv(i, 0x8000) != intdiv(i - counter + 1, 0x8000)) {
                counter = (i % 0x8000) + 1;
                continue;
            }
            else {
                return (i - counter + 1) + 0x200;
            }
        }
    }
    return 0;
}
function stage_onmousemove(e) {
    e.stopPropagation();
    if (!isPress)
        return;
    let data;
    if (editMode == "layer1") {
        data = layer1Data;
    }
    else if (editMode == "layer2") {
        data = layer2Data;
    }
    else {
        data = layer1Data;
    }
    let index;
    index = safeParseInt(target.getAttribute("data-index"));
    const deltaX = Math.floor((e.clientX - prevPosX) / 16) * 16;
    const deltaY = Math.floor((e.clientY - prevPosY) / 16) * 16;
    if (!((prevObjLeft + deltaX) >= 0 && (prevObjLeft + deltaX) <= this.offsetWidth - 1)) {
        return;
    }
    if (!((prevObjTop + deltaY) >= 0 && (prevObjTop + deltaY) <= this.offsetHeight - 1)) {
        return;
    }
    if (editMode == "layer1" || editMode == "layer2") {
        data[index].screen = Math.floor(Math.floor((prevObjLeft + deltaX) / 16) / 16) & 0b11111;
        if (isVertical) {
            data[index].y = getRealY((Math.floor((prevObjLeft + deltaX) / 16) % 16), data[index]) & 0b11111;
            data[index].x = getRealX(Math.floor((prevObjTop + deltaY) / 16) & 0b1111, data[index]) & 0b1111;
        }
        else {
            data[index].x = getRealX((Math.floor((prevObjLeft + deltaX) / 16) % 16), data[index]) & 0b1111;
            data[index].y = getRealY(Math.floor((prevObjTop + deltaY) / 16) & 0b11111, data[index]) & 0b11111;
        }
    }
    else {
        sprites[index].screenNum = Math.floor(Math.floor((prevObjLeft + deltaX) / 16) / 16) & 0b11111;
        if (isVertical) {
            sprites[index].yPosition = (Math.floor((prevObjLeft + deltaX) / 16) % 16) & 0b11111;
            sprites[index].xPosition = Math.floor((prevObjTop + deltaY) / 16) & 0b1111;
        }
        else {
            sprites[index].xPosition = (Math.floor((prevObjLeft + deltaX) / 16) % 16) & 0b1111;
            sprites[index].yPosition = Math.floor((prevObjTop + deltaY) / 16) & 0b11111;
        }
    }
    target.style.left = ((prevObjLeft + deltaX)) + "px";
    target.style.top = ((prevObjTop + deltaY)) + "px";
}
function obj_onmousedown(e) {
    e.stopPropagation();
    if (!this.classList.contains(editMode)) {
        return;
    }
    let objects = document.querySelectorAll(".object, .sprite");
    for (let i = 0; i < objects.length; i++) {
        let obj = objects[i];
        //obj.style.border = "1px solid black";
        //obj.style.color = "black";
        obj.style.filter = '';
        obj.blur();
    }
    //this.style.border = "1px solid red";
    this.style.filter = 'invert(100%)';
    this.focus();
    isPress = true;
    prevObjLeft = this.offsetLeft;
    prevObjTop = this.offsetTop;
    prevPosX = e.clientX;
    prevPosY = e.clientY;
    target = this;
}
function stage_onmousedown(e) {
    e.stopPropagation();
    let objects = document.querySelectorAll(".object, .sprite");
    for (let i = 0; i < objects.length; i++) {
        let obj = objects[i];
        obj.style.filter = '';
        obj.blur();
    }
    isPress = false;
}
function obj_onmouseup(e) {
    e.stopPropagation();
    isPress = false;
}
function stage_onmouseup(e) {
    e.stopPropagation();
    isPress = false;
}
function stage_onkeydown(e) {
    if (e.code == "Insert") {
        let data;
        if (editMode == "layer1") {
            data = layer1Data;
        }
        else if (editMode == "layer2") {
            data = layer2Data;
        }
        else {
            data = layer1Data;
        }
        if (editMode == "layer1" || editMode == "layer2") {
            let input;
            let val;
            input = prompt("Object Number? (in hex)", "01");
            if (input === null)
                return;
            let initValue = 0;
            try {
                val = safeParseInt("0x" + input);
                val = val & 0b111111;
                if (!(val >= 0 && val <= 255)) {
                    throw new Error();
                }
                if (val === 0) {
                    initValue = 0x10;
                }
                else if (val > 0x21 && val < 0x30) {
                    throw new Error();
                }
            }
            catch (e) {
                alert("Invalid");
                return;
            }
            let obj;
            obj = new Obj(val, 0, 0, initValue);
            data.push(obj);
            //render();      
            let stage = document.querySelector("#stage");
            let myObject = create_object_view(obj, data.length - 1, editMode);
            stage.appendChild(myObject);
        }
        else {
            let input;
            let val;
            input = prompt("Object Number? (in hex)", "01");
            if (input === null)
                return;
            try {
                val = safeParseInt("0x" + input);
                val = val & 0xFF;
                if (!(val >= 0 && val <= 255)) {
                    throw new Error();
                }
            }
            catch (e) {
                alert("Invalid");
                return;
            }
            let spr;
            spr = new Sprite();
            spr.screenNum = 0;
            spr.xPosition = 0;
            spr.yPosition = 0;
            spr.extra = 0;
            spr.spriteID = val;
            sprites.push(spr);
            //render();
            let stage = document.querySelector("#stage");
            let myObject = create_object_view(spr, sprites.length - 1, "sprite");
            stage.appendChild(myObject);
        }
    }
}
function obj_onkeydown(e) {
    let data;
    if (!this.classList.contains(editMode)) {
        return;
    }
    if (editMode == "layer1") {
        data = layer1Data;
    }
    else if (editMode == "layer2") {
        data = layer2Data;
    }
    else {
        return;
    }
    if (e.code == "Delete") {
        let index = safeParseInt(this.getAttribute("data-index"));
        let elements = document.querySelectorAll(".object." + editMode);
        for (let i = index; i < data.length - 1; i++) {
            data[i] = data[i + 1];
        }
        for (let i = index; i < data.length - 1; i++) {
            elements[i].setAttribute("data-index", (i - 1).toString());
        }
        data.length = data.length - 1;
        this.parentElement.removeChild(this);
        return;
    }
    else if (e.code == "Equal" || e.code == "NumpadAdd") {
        let index = safeParseInt(this.getAttribute("data-index"));
        let element;
        if (editMode == "layer1") {
            element = document.querySelector('.layer1.object[data-index="' + (index + 1) + '"]');
        }
        else if (editMode == "layer2") {
            element = document.querySelector('.layer2.object[data-index="' + (index + 1) + '"]');
        }
        else {
            return;
        }
        if (index < data.length - 1) {
            let temp;
            temp = data[index];
            data[index] = data[index + 1];
            data[index + 1] = temp;
            let zIndex;
            if (editMode == "layer1") {
                zIndex = index + 0x800000;
            }
            else if (editMode == "layer2") {
                zIndex = index;
            }
            else {
                zIndex = 0x1800000;
            }
            element.style.zIndex = zIndex + "";
            element.setAttribute("data-index", index);
            this.setAttribute("data-index", index + 1);
            this.style.zIndex = (zIndex + 1) + "";
        }
        else {
            return;
        }
    }
    else if (e.code == "Minus" || e.code == "NumpadSubtract") {
        let index = safeParseInt(this.getAttribute("data-index"));
        let element;
        if (editMode == "layer1") {
            element = document.querySelector('.layer1.object[data-index="' + (index - 1) + '"]');
        }
        else if (editMode == "layer2") {
            element = document.querySelector('.layer2.object[data-index="' + (index - 1) + '"]');
        }
        else {
            return;
        }
        if (index > 0) {
            let temp;
            temp = data[index];
            data[index] = data[index - 1];
            data[index - 1] = temp;
            let zIndex;
            if (editMode == "layer1") {
                zIndex = index + 0x800000;
            }
            else if (editMode == "layer2") {
                zIndex = index;
            }
            else {
                zIndex = 0x1800000;
            }
            element.style.zIndex = zIndex + "";
            element.setAttribute("data-index", index);
            this.setAttribute("data-index", index - 1);
            this.style.zIndex = (zIndex - 1) + "";
        }
        else {
            return;
        }
    }
}
function spr_onkeydown(e) {
    if (!this.classList.contains(editMode)) {
        return;
    }
    if (e.code === "Delete") {
        let index = safeParseInt(this.getAttribute("data-index"));
        let elements = document.querySelectorAll(".sprite");
        for (let i = index; i < sprites.length - 1; i++) {
            sprites[i] = sprites[i + 1];
        }
        for (let i = index; i < sprites.length - 1; i++) {
            elements[i].setAttribute("data-index", (i - 1).toString());
        }
        sprites.length = sprites.length - 1;
        this.parentElement.removeChild(this);
        return;
    }
}
function obj_ondblclick(e) {
    let data;
    let index;
    let extraData;
    let input;
    let val;
    let objNum;
    let width, height;
    if (!this.classList.contains(editMode)) {
        return;
    }
    if (editMode == "layer1") {
        data = layer1Data;
    }
    else if (editMode == "layer2") {
        data = layer2Data;
    }
    else {
        return;
    }
    index = safeParseInt(this.getAttribute("data-index"));
    extraData = data[index].settings;
    objNum = data[index].objNum;
    input = prompt("Size/Type/Ext (0-FF)", hex(extraData));
    if (input === null) {
        return;
    }
    const obj = data[index];
    try {
        val = safeParseInt("0x" + input);
        val = val & 0xFF;
        if (!(val >= 0 && val <= 255)) {
            throw new Error();
        }
        if (objNum === 0) {
            if (val < 0x10) {
                throw new Error();
            }
        }
        if (0x21 < objNum && objNum < 0x30) {
            throw new Error();
        }
    }
    catch (e) {
        alert("Invalid");
        return;
    }
    data[index].settings = val & 0xFF;
    this.title = (hex(objNum) + "\n") + hex(val);
    width = getObjWidth(obj);
    height = getObjHeight(obj);
    this.style.width = (width * 16) + 'px';
    this.style.height = (height * 16) + 'px';
    const img = getObjImage(obj);
    if (img) {
        this.style.border = "";
        this.style.backgroundColor = '';
        this.style.backgroundImage = `url(${img})`;
    }
    const screen = obj.screen;
    const x = getX(obj);
    const y = getY(obj);
    if (isVertical) {
        this.style.top = ((256 * screen) + (x * 16)) + 'px';
        this.style.left = (y * 16) + 'px';
    }
    else {
        this.style.top = (y * 16) + 'px';
        this.style.left = ((256 * screen) + (x * 16)) + 'px';
    }
}
function spr_ondblclick(e) {
    if (!this.classList.contains(editMode)) {
        return;
    }
    let index;
    let extra;
    index = safeParseInt(this.getAttribute("data-index"));
    extra = sprites[index].extra;
    let input;
    input = prompt("Extra info (0-3)", hex(extra));
    if (input === null) {
        return;
    }
    let val;
    try {
        val = safeParseInt("0x" + input);
        val = val & 0b11;
        if (!(val >= 0 && val <= 3)) {
            throw new Error();
        }
    }
    catch (e) {
        alert("Invalid");
        return;
    }
    sprites[index].extra = val & 0b11;
    this.title = hex(sprites[index].spriteID) + "\n" + hex(val);
    const spr = sprites[index];
    const img = getSprImg(spr.spriteID, spr.extra);
    if (img) {
        this.style.border = "";
        this.style.backgroundColor = '';
        this.style.backgroundImage = `url(${img})`;
    }
}
function window_onload() {
    btnOpen = document.getElementById("btnOpen");
    btnPalette = document.getElementById("btnPalette");
    btn8x8 = document.getElementById("btn8x8");
    btn16x16 = document.getElementById("btn16x16");
    btnLevelToImage = document.getElementById("btnLevelToImage");
    btnLevelHeader = document.getElementById("btnLevelHeader");
    btnGFX = document.getElementById("btnGFX");
    btnSprHeader = document.getElementById("btnSprHeader");
    btnOtherHeader = document.getElementById("btnOtherHeader");
    btnEnter = document.getElementById("btnEnter");
    btnSwitchBG = document.getElementById("btnSwitchBG");
    btnBGCancel = document.getElementById("btnBGCancel");
    btnBGOK = document.getElementById("btnBGOK");
    selBG = (document.getElementById("selBG"));
    btnEnterOK = document.getElementById("btnEnterOK");
    btnEnterCancel = document.getElementById("btnEnterCancel");
    btnSprHeaderOK = document.getElementById("btnSprHeaderOK");
    btnSprHeaderCancel = document.getElementById("btnSprHeaderCancel");
    btnOtherHeaderOK = document.getElementById("btnOtherHeaderOK");
    btnOtherHeaderCancel = document.getElementById("btnOtherHeaderCancel");
    btnPaletteOK = document.getElementById("btnPaletteOK");
    btnPaletteCancel = document.getElementById("btnPaletteCancel");
    selBackColor = document.getElementById("selBackColor");
    selFGColor = document.getElementById("selFGColor");
    selBGColor = document.getElementById("selBGColor");
    selSprColor = document.getElementById("selSprColor");
    btnGFXOK = document.getElementById("btnGFXOK");
    btnGFXCancel = document.getElementById("btnGFXCancel");
    main = document.getElementById("main");
    btnHeaderOK = document.getElementById("btnHeaderOK");
    btnHeaderCancel = document.getElementById("btnHeaderCancel");
    btnExit = document.getElementById("btnExit");
    selScrNumber = document.getElementById("selScrNumber");
    btnExitOK = document.getElementById("btnExitOK");
    btnExitDelete = document.getElementById("btnExitDelete");
    btnExitCancel = document.getElementById("btnExitCancel");
    btn2ndExit = document.getElementById("btn2ndExit");
    sel2ndEnter = document.getElementById("sel2ndEnter");
    btn2ndOK = document.getElementById("btn2ndOK");
    btn2ndCancel = document.getElementById("btn2ndCancel");
    btnSave = document.getElementById("btnSave");
    document.getElementById("paletteView").onclick = paletteView_onclick;
    btnPalette.onclick = btnPalette_onclick;
    btnOpen.onclick = btnOpen_onclick;
    btn8x8.onclick = btn8x8_onclick;
    btn16x16.onclick = btn16x16_onclick;
    btnLevelToImage.onclick = btnLevelToImage_onclick;
    btnLevelHeader.onclick = btnLevelHeader_onclick;
    btnGFX.onclick = btnGFX_onclick;
    btnSprHeader.onclick = btnSprHeader_onclick;
    btnOtherHeader.onclick = btnOtherHeader_onclick;
    btnEnter.onclick = btnEnter_onclick;
    btnSwitchBG.onclick = btnSwitchBG_onclick;
    btnBGCancel.onclick = btnBGCancel_onclick;
    btnBGOK.onclick = btnBGOK_onclick;
    selBG.onchange = selBG_onchange;
    btnEnterCancel.onclick = btnEnterCancel_onclick;
    btnEnterOK.onclick = btnEnterOK_onclick;
    btnSprHeaderOK.onclick = btnSprHeaderOK_onclick;
    btnSprHeaderCancel.onclick = btnSprHeaderCancel_onclick;
    btnOtherHeaderOK.onclick = btnOtherHeaderOK_onclick;
    btnOtherHeaderCancel.onclick = btnOtherHeaderCancel_onclick;
    btnPaletteOK.onclick = btnPaletteOK_onclick;
    btnPaletteCancel.onclick = btnPaletteCancel_onclick;
    selBackColor.onchange = selBackColor_onchange;
    selFGColor.onchange = selFGColor_onchange;
    selBGColor.onchange = selBGColor_onchange;
    selSprColor.onchange = selSprColor_onchange;
    btnGFXOK.onclick = btnGFXOK_onclick;
    btnGFXCancel.onclick = btnGFXCancel_onclick;
    btnHeaderOK.onclick = btnHeaderOK_onclick;
    btnHeaderCancel.onclick = btnHeaderCancel_onclick;
    btnExit.onclick = btnExit_onclick;
    selScrNumber.onchange = selScrNumber_onchange;
    btnExitOK.onclick = btnExitOK_onclick;
    btnExitDelete.onclick = btnExitDelete_onclick;
    btnExitCancel.onclick = btnExitCancel_onclick;
    btn2ndExit.onclick = btn2ndExit_onclick;
    btn2ndOK.onclick = btn2ndOK_onclick;
    btn2ndCancel.onclick = btn2ndCancel_onclick;
    btnSave.onclick = btnSave_onclick;
}
window.onload = window_onload;
function btnSave_onclick() {
    save();
    const buffer = (new Uint8Array(fileData)).buffer;
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = fileName;
    a.click();
}
function btnPalette_onclick() {
    let dialogPalette = document.getElementById("dialogPalette");
    if (dialogPalette?.classList.contains("hidden")) {
        dialogPalette.classList.remove("hidden");
    }
    else {
        dialogPalette.classList.add("hidden");
        return;
    }
    let backColor = getBackAreaColor(backAreaColorNum);
    document.getElementById("backColorView").style.backgroundColor = `rgb(${backColor.r}, ${backColor.g}, ${backColor.b})`;
    let paletteImage = getPalImage(pal);
    let paletteView = document.getElementById("paletteView");
    paletteView.width = paletteImage.width;
    paletteView.height = paletteImage.height;
    let ctx = paletteView.getContext("2d");
    ctx.putImageData(paletteImage, 0, 0);
    let selBackColor = document.getElementById("selBackColor");
    let selBGColor = document.getElementById("selBGColor");
    let selFGColor = document.getElementById("selFGColor");
    let selSprColor = document.getElementById("selSprColor");
    selBackColor.value = backAreaColorNum.toString();
    selBGColor.value = bgPalNum.toString();
    selFGColor.value = fgPalNum.toString();
    selSprColor.value = spPalNum.toString();
}
function btn16x16_onclick() {
    if (fileName == "") {
        alert("Open the file");
        return;
    }
    let oldCanvas;
    oldCanvas = document.getElementById("cnv16x16");
    if (oldCanvas) {
        document.body.removeChild(oldCanvas);
        return;
    }
    let canvas = document.createElement("canvas");
    canvas.id = "cnv16x16";
    canvas.style.border = "1px solid black";
    canvas.width = 16 * 16;
    canvas.style.backgroundColor = `rgb(${bgColor.r}, ${bgColor.g}, ${bgColor.b})`;
    let ctx = canvas.getContext("2d");
    const blksLength = map16.length;
    const bgTilesLength = bgTiles.length;
    const limit = 0x500;
    const bgLimit = 0x200;
    const blksHeight = Math.ceil(limit / 16);
    const bgTilesHeight = Math.ceil(bgLimit / 16);
    canvas.height = blksHeight * 16 + bgTilesHeight * 16;
    for (let i = 0x0; i < limit; i++) {
        const tile = getMap16TileImg(i);
        ctx.putImageData(tile, (i % 16) * 16, intdiv(i, 16) * 16);
    }
    // background tiles
    for (let i = 0x0; i < bgLimit; i++) {
        const tile = getMap16TileImg(i, true);
        ctx.putImageData(tile, ((i % 16) * 16), ((blksHeight * 16) + (intdiv(i, 16) * 16)));
    }
    document.body.appendChild(canvas);
}
function btn8x8_onclick() {
    if (fileName == "") {
        alert("Open the file");
        return;
    }
    const dotSize = 2;
    let canvas;
    canvas = document.getElementById("cnv8x8");
    if (canvas) {
        document.body.removeChild(canvas);
        return;
    }
    canvas = document.createElement("canvas");
    canvas.id = "cnv8x8";
    canvas.style.border = "1px solid black";
    canvas.width = dotSize * 8 * 16;
    canvas.height = dotSize * (8 * 16 * 3 + 8 * 16 * 2);
    let ctx = canvas.getContext("2d");
    const bitmaps = [fg1bmp, fg2bmp, bgbmp, fg3bmp, bg2bmp, bg3bmp, sp1bmp, sp2bmp, sp3bmp, sp4bmp];
    for (let i = 0; i < bitmaps.length; i++) {
        const bitmap = bitmaps[i];
        for (let j = 0; j < bitmap.length; j++) {
            const bmp = bitmap[j];
            const div = intdiv(j, 16);
            const mod = j % 16;
            ;
            for (let k = 0; k < 64; k++) {
                const color = pal[0][bmp[k]];
                const r = color.r;
                const g = color.g;
                const b = color.b;
                ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
                ctx.fillRect((dotSize * 8 * mod) + ((k % 8) * dotSize), (dotSize * 8 * div) + ((Math.floor(k / 8)) * dotSize) + ((64 * i) * dotSize), dotSize, dotSize);
            }
        }
    }
    document.body.appendChild(canvas);
}
function btnOpen_onclick() {
    fileOpen();
}
function btnLevelToImage_onclick() {
    const global = globalThis;
    if (fileName == "") {
        alert("Open the ROM");
        return;
    }
    if (!global.html2canvas) {
        alert("html2canvas lib not found");
        return;
    }
    const stage = document.querySelector("#stage");
    global.html2canvas(stage, {
        allowTaint: true,
        useCORS: true,
        scale: 1,
    }).then(function (canvas) {
        const url = canvas.toDataURL();
        const a = document.createElement("a");
        a.href = url;
        a.download = "Level" + levelNum.toString(16).toUpperCase() + ".png";
        a.click();
    }).catch(function (err) {
        alert("Error: " + err.message);
        return;
    });
}
function btnLevelHeader_onclick() {
    let dialogLevelHeader = document.getElementById("dialogLevelHeader");
    if (dialogLevelHeader?.classList.contains("hidden")) {
        dialogLevelHeader.classList.remove("hidden");
    }
    else {
        dialogLevelHeader.classList.add("hidden");
        return;
    }
    const selLevelMode = document.getElementById("selLevelMode");
    const selTimer = document.getElementById("selTimer");
    const selMusic = document.getElementById("selMusic");
    const selScreenLength = document.getElementById("selScreenLength");
    const selItemMemory = document.getElementById("selItemMemory");
    const checkForceLayer3 = document.getElementById("checkForceLayer3");
    const selVerticalScrollSetting = document.getElementById("selVerticalScrollSetting");
    selLevelMode.value = levelMode.toString();
    selTimer.value = timer.toString();
    selMusic.value = music.toString();
    selScreenLength.value = screenLength.toString();
    selItemMemory.value = itemMemory.toString();
    selVerticalScrollSetting.value = verticalScrollSetting.toString();
    if (layer3Prior) {
        checkForceLayer3.checked = true;
    }
    else {
        checkForceLayer3.checked = false;
    }
}
function btn2ndOK_onclick() {
    const txt2ndDest = document.getElementById("txt2ndDest");
    const txt2ndScrNum = document.getElementById("txt2ndScrNum");
    const sel2ndEnterX = document.getElementById("sel2ndEnterX");
    const sel2ndEnterY = document.getElementById("sel2ndEnterY");
    const sel2ndEnterFG = document.getElementById("sel2ndEnterFG");
    const sel2ndEnterBG = document.getElementById("sel2ndEnterBG");
    const sel2ndMarioAction = document.getElementById("sel2ndMarioAction");
    const index = safeParseInt(sel2ndEnter.value);
    const exit = secondExits[index];
    let dest;
    let scrNum;
    try {
        scrNum = safeParseInt('0x' + txt2ndScrNum.value);
    }
    catch (e) {
        scrNum = 0;
    }
    try {
        dest = safeParseInt('0x' + txt2ndDest.value);
    }
    catch (e) {
        dest = 0;
    }
    exit.dest = dest;
    exit.scrNum = scrNum;
    exit.action = safeParseInt(sel2ndMarioAction.value);
    exit.bg = safeParseInt(sel2ndEnterBG.value);
    exit.fg = safeParseInt(sel2ndEnterFG.value);
    exit.x = safeParseInt(sel2ndEnterX.value);
    exit.y = safeParseInt(sel2ndEnterY.value);
    exit.modified = true;
    let dialog = document.getElementById("dialog2ndExit");
    if (dialog?.classList.contains("hidden")) {
        dialog.classList.remove("hidden");
    }
    else {
        dialog.classList.add("hidden");
        return;
    }
}
function btn2ndExit_onclick() {
    let dialog = document.getElementById("dialog2ndExit");
    if (dialog?.classList.contains("hidden")) {
        dialog.classList.remove("hidden");
    }
    else {
        dialog.classList.add("hidden");
        return;
    }
    let parent = sel2ndEnter.parentElement;
    let oldIndex;
    if (sel2ndEnter.value === "") {
        oldIndex = 0;
    }
    else {
        oldIndex = safeParseInt(sel2ndEnter.value);
    }
    parent.removeChild(sel2ndEnter);
    sel2ndEnter = document.createElement("select");
    sel2ndEnter.id = 'sel2ndEnter';
    parent.appendChild(sel2ndEnter);
    sel2ndEnter.onchange = sel2ndEnter_onchange;
    for (let i = 0; i < secondExits.length; i++) {
        const exit = secondExits[i];
        const option = document.createElement("option");
        option.value = i + "";
        if (exit.dest == 0 || exit.dest == 0x100) {
            option.innerText = '#' + hex(i, 3);
        }
        else {
            option.innerText = '#' + hex(i, 3) + " to Level " + hex(exit.dest, 3);
        }
        sel2ndEnter.appendChild(option);
    }
    sel2ndEnter.value = oldIndex + '';
    sel2ndEnter_onchange();
}
function sel2ndEnter_onchange() {
    const that = sel2ndEnter;
    const index = safeParseInt(that.value);
    const txt2ndDest = document.getElementById("txt2ndDest");
    const txt2ndScrNum = document.getElementById("txt2ndScrNum");
    const sel2ndEnterX = document.getElementById("sel2ndEnterX");
    const sel2ndEnterY = document.getElementById("sel2ndEnterY");
    const sel2ndEnterFG = document.getElementById("sel2ndEnterFG");
    const sel2ndEnterBG = document.getElementById("sel2ndEnterBG");
    const sel2ndMarioAction = document.getElementById("sel2ndMarioAction");
    txt2ndDest.value = secondExits[index].dest.toString(16).toUpperCase();
    txt2ndScrNum.value = secondExits[index].scrNum.toString(16).toUpperCase();
    sel2ndEnterX.value = secondExits[index].x.toString();
    sel2ndEnterY.value = secondExits[index].y.toString();
    sel2ndEnterFG.value = secondExits[index].fg.toString();
    sel2ndEnterBG.value = secondExits[index].bg.toString();
    sel2ndMarioAction.value = secondExits[index].action.toString();
}
function btn2ndCancel_onclick() {
    let dialog = document.getElementById("dialog2ndExit");
    if (dialog?.classList.contains("hidden")) {
        dialog.classList.remove("hidden");
    }
    else {
        dialog.classList.add("hidden");
        return;
    }
}
function btnExitOK_onclick() {
    const chkUseSecond = document.getElementById("chkUseSecond");
    const chkUseSecondWater = document.getElementById("chkUseSecondWater");
    const txtExitDest = document.getElementById("txtExitDest");
    const scrNum = safeParseInt(selScrNumber.value);
    const useSecond = ((chkUseSecond.checked) ? 1 : 0);
    const useSecondWater = ((chkUseSecondWater.checked) ? 1 : 0);
    const dest = safeParseInt("0x" + txtExitDest.value);
    let i;
    for (i = 0; i < exits.length; i++) {
        const exit = exits[i];
        if (exit.scrNumber == scrNum) {
            exit.destLevel = dest;
            exit.isSecond = useSecond;
            exit.isWaterMid = useSecondWater;
            break;
        }
    }
    if (i == exits.length) {
        const exit = new Exit();
        exit.scrNumber = scrNum;
        exit.destLevel = dest;
        exit.isSecond = useSecond;
        exit.isWaterMid = useSecondWater;
        exits.push(exit);
    }
    let dialog = document.getElementById("dialogExit");
    if (dialog?.classList.contains("hidden")) {
        dialog.classList.remove("hidden");
    }
    else {
        dialog.classList.add("hidden");
        return;
    }
}
function btnExitDelete_onclick() {
    const scrNum = safeParseInt(selScrNumber.value);
    for (let i = 0; i < exits.length; i++) {
        let exit = exits[i];
        if (exit.scrNumber == scrNum) {
            exits.splice(i, 1);
        }
    }
    let dialog = document.getElementById("dialogExit");
    if (dialog?.classList.contains("hidden")) {
        dialog.classList.remove("hidden");
    }
    else {
        dialog.classList.add("hidden");
        return;
    }
}
function btnExitCancel_onclick() {
    let dialog = document.getElementById("dialogExit");
    if (dialog?.classList.contains("hidden")) {
        dialog.classList.remove("hidden");
    }
    else {
        dialog.classList.add("hidden");
        return;
    }
}
function btnExit_onclick() {
    let dialog = document.getElementById("dialogExit");
    if (dialog?.classList.contains("hidden")) {
        dialog.classList.remove("hidden");
    }
    else {
        dialog.classList.add("hidden");
        return;
    }
    selScrNumber.value = "0";
    selScrNumber_onchange();
}
function selScrNumber_onchange() {
    const that = selScrNumber;
    const scrNum = safeParseInt(that.value);
    const txtExitDest = document.getElementById("txtExitDest");
    const chkUseSecond = document.getElementById("chkUseSecond");
    const chkUseSecondWater = document.getElementById("chkUseSecondWater");
    txtExitDest.value = "0";
    chkUseSecond.checked = false;
    chkUseSecondWater.checked = false;
    chkUseSecondWater.disabled = true;
    for (let i = 0; i < exits.length; i++) {
        let exit = exits[i];
        if (exit.scrNumber === scrNum) {
            txtExitDest.value = exit.destLevel.toString(16).toUpperCase() + "";
            if (exit.isSecond) {
                chkUseSecond.checked = true;
                chkUseSecondWater.disabled = false;
            }
            else {
                chkUseSecond.checked = false;
                chkUseSecondWater.disabled = true;
            }
            if (exit.isWaterMid) {
                chkUseSecondWater.checked = true;
            }
            else {
                chkUseSecondWater.checked = false;
            }
            return;
        }
    }
}
function btnHeaderOK_onclick() {
    const selLevelMode = document.getElementById("selLevelMode");
    const selTimer = document.getElementById("selTimer");
    const selMusic = document.getElementById("selMusic");
    const selScreenLength = document.getElementById("selScreenLength");
    const selItemMemory = document.getElementById("selItemMemory");
    const checkForceLayer3 = document.getElementById("checkForceLayer3");
    const selVerticalScrollSetting = document.getElementById("selVerticalScrollSetting");
    const oldIsLayer2 = isLayer2;
    const oldIsVertical = isVertical;
    const oldLevelMode = levelMode;
    const newLevelMode = safeParseInt(selLevelMode.value);
    const newIsVertical = !!(verticalList[newLevelMode]);
    const newIsLayer2 = !!(layer2List[newLevelMode] != 0);
    if (oldIsLayer2 == true && newIsLayer2 == false) {
        layer2Data = new Array();
        bgPointer = 0x0CE8EE;
        bgPage = getBGPage(bgPointer);
        bgData = loadBG(bgPointer);
        layer2DataPointer = 0;
    }
    else if (oldIsLayer2 == false && newIsLayer2 == true) {
        layer2Data = new Array();
        bgPointer = 0;
        bgPage = 0;
        bgData = loadBG(bgPointer);
    }
    levelMode = newLevelMode;
    isLayer2 = newIsLayer2;
    isVertical = newIsVertical;
    timer = safeParseInt(selTimer.value);
    music = safeParseInt(selMusic.value);
    screenLength = safeParseInt(selScreenLength.value);
    itemMemory = safeParseInt(selItemMemory.value);
    verticalScrollSetting = safeParseInt(selVerticalScrollSetting.value);
    if (checkForceLayer3.checked == true) {
        layer3Prior = 1;
    }
    else {
        layer3Prior = 0;
    }
    render();
    let dialog = document.getElementById("dialogLevelHeader");
    if (dialog?.classList.contains("hidden")) {
        dialog.classList.remove("hidden");
    }
    else {
        dialog.classList.add("hidden");
        return;
    }
}
function btnHeaderCancel_onclick() {
    let dialog = document.getElementById("dialogLevelHeader");
    if (dialog?.classList.contains("hidden")) {
        dialog.classList.remove("hidden");
    }
    else {
        dialog.classList.add("hidden");
        return;
    }
}
function btnGFXOK_onclick() {
    const selFGBGGFX = document.getElementById("selFGBGGFX");
    const selSprGFX = document.getElementById("selSprGFX");
    fgbgGFX = safeParseInt(selFGBGGFX.value);
    sprGFX = safeParseInt(selSprGFX.value);
    loadGraphics();
    load16x16();
    render();
    let dialog = document.getElementById("dialogGFX");
    if (dialog?.classList.contains("hidden")) {
        dialog.classList.remove("hidden");
    }
    else {
        dialog.classList.add("hidden");
        return;
    }
}
function btnGFXCancel_onclick() {
    let dialog = document.getElementById("dialogGFX");
    if (dialog?.classList.contains("hidden")) {
        dialog.classList.remove("hidden");
    }
    else {
        dialog.classList.add("hidden");
        return;
    }
}
function paletteView_onclick() {
    alert("Color editing is not implemented.");
    return;
}
function selBackColor_onchange() {
    selColor_onchange();
}
function selFGColor_onchange() {
    selColor_onchange();
}
function selBGColor_onchange() {
    selColor_onchange();
}
function selSprColor_onchange() {
    selColor_onchange();
}
function selColor_onchange() {
    let selBackColor = document.getElementById("selBackColor");
    let selBGColor = document.getElementById("selBGColor");
    let selFGColor = document.getElementById("selFGColor");
    let selSprColor = document.getElementById("selSprColor");
    let backAreaColorNum, bgPalNum, fgPalNum, spPalNum;
    backAreaColorNum = safeParseInt(selBackColor.value);
    bgPalNum = safeParseInt(selBGColor.value);
    fgPalNum = safeParseInt(selFGColor.value);
    spPalNum = safeParseInt(selSprColor.value);
    let backColor = getBackAreaColor(backAreaColorNum);
    document.getElementById("backColorView").style.backgroundColor = `rgb(${backColor.r}, ${backColor.g}, ${backColor.b})`;
    let pal, bgColor;
    bgColor = getBackAreaColor(backAreaColorNum);
    pal = getPalette(bgPalNum, fgPalNum, spPalNum);
    let paletteImage = getPalImage(pal);
    let paletteView = document.getElementById("paletteView");
    paletteView.width = paletteImage.width;
    paletteView.height = paletteImage.height;
    let ctx = paletteView.getContext("2d");
    ctx.putImageData(paletteImage, 0, 0);
}
function btnPaletteOK_onclick() {
    let selBackColor = document.getElementById("selBackColor");
    let selBGColor = document.getElementById("selBGColor");
    let selFGColor = document.getElementById("selFGColor");
    let selSprColor = document.getElementById("selSprColor");
    backAreaColorNum = safeParseInt(selBackColor.value);
    bgPalNum = safeParseInt(selBGColor.value);
    fgPalNum = safeParseInt(selFGColor.value);
    spPalNum = safeParseInt(selSprColor.value);
    bgColor = getBackAreaColor(backAreaColorNum);
    pal = getPalette(bgPalNum, fgPalNum, spPalNum);
    btnSwitchBG.click();
    btnSwitchBG.click();
    renderBG();
    let dialog = document.getElementById("dialogPalette");
    if (dialog?.classList.contains("hidden")) {
        dialog.classList.remove("hidden");
    }
    else {
        dialog.classList.add("hidden");
        return;
    }
}
function btnPaletteCancel_onclick() {
    let dialog = document.getElementById("dialogPalette");
    if (dialog?.classList.contains("hidden")) {
        dialog.classList.remove("hidden");
    }
    else {
        dialog.classList.add("hidden");
        return;
    }
}
function btnOtherHeaderOK_onclick() {
    const selLayer2ScrollingRate = document.getElementById("selLayer2ScrollingRate");
    const selLayer3Option = document.getElementById("selLayer3Option");
    const checkVerticalLevelPositioning = document.getElementById("checkVerticalLevelPositioning");
    const checkVerticalLevelUnknown = document.getElementById("checkVerticalLevelUnknown");
    const checkDisableNoYoshi = document.getElementById("checkDisableNoYoshi");
    layer2ScrollSetting = safeParseInt(selLayer2ScrollingRate.value);
    layer3Setting = safeParseInt(selLayer3Option.value);
    if (checkVerticalLevelPositioning.checked) {
        verticalLevelPositioning = 1;
    }
    else {
        verticalLevelPositioning = 0;
    }
    if (checkVerticalLevelUnknown.checked) {
        verticalLevelUnknown = 1;
    }
    else {
        verticalLevelUnknown = 0;
    }
    if (checkDisableNoYoshi.checked) {
        disableNoYoshi = 1;
    }
    else {
        disableNoYoshi = 0;
    }
    let dialog = document.getElementById("dialogOtherHeader");
    if (dialog?.classList.contains("hidden")) {
        dialog.classList.remove("hidden");
    }
    else {
        dialog.classList.add("hidden");
        return;
    }
}
function btnOtherHeaderCancel_onclick() {
    let dialog = document.getElementById("dialogOtherHeader");
    if (dialog?.classList.contains("hidden")) {
        dialog.classList.remove("hidden");
    }
    else {
        dialog.classList.add("hidden");
        return;
    }
}
function btnSprHeaderOK_onclick() {
    const selSprMemory = document.getElementById("selSprMemory");
    const schkSprBuoy1 = document.getElementById("chkSprBuoy1");
    const schkSprBuoy2 = document.getElementById("chkSprBuoy2");
    sprMemory = safeParseInt(selSprMemory.value);
    if (schkSprBuoy1.checked) {
        buoyancy = 1;
    }
    else {
        buoyancy = 0;
    }
    if (schkSprBuoy2.checked) {
        buoyancy2 = 1;
    }
    else {
        buoyancy2 = 0;
    }
    let dialog = document.getElementById("dialogSprHeader");
    if (dialog?.classList.contains("hidden")) {
        dialog.classList.remove("hidden");
    }
    else {
        dialog.classList.add("hidden");
        return;
    }
}
function btnSprHeaderCancel_onclick() {
    let dialog = document.getElementById("dialogSprHeader");
    if (dialog?.classList.contains("hidden")) {
        dialog.classList.remove("hidden");
    }
    else {
        dialog.classList.add("hidden");
        return;
    }
}
function btnEnterOK_onclick() {
    const txtScrNum = document.getElementById("scrNum");
    const txtMidNum = document.getElementById("midNum");
    const selEnterX = document.getElementById("selEnterX");
    const selEnterY = document.getElementById("selEnterY");
    const selEnterFG = document.getElementById("selEnterFG");
    const selEnterBG = document.getElementById("selEnterBG");
    const selMarioAction = document.getElementById("selMarioAction");
    enterX = safeParseInt(selEnterX.value);
    enterY = safeParseInt(selEnterY.value);
    enterFG = safeParseInt(selEnterFG.value);
    enterBG = safeParseInt(selEnterBG.value);
    enterAction = safeParseInt(selMarioAction.value);
    let scrNum, midNum;
    try {
        scrNum = safeParseInt("0x" + txtScrNum.value);
    }
    catch (e) {
        scrNum = 0;
    }
    try {
        midNum = safeParseInt("0x" + txtMidNum.value);
    }
    catch (e) {
        midNum = 0;
    }
    if (scrNum < 0) {
        scrNum = 0;
    }
    else if (scrNum > 0x1F) {
        scrNum = 0x1F;
    }
    if (midNum < 0) {
        midNum = 0;
    }
    else if (midNum > 0xF) {
        midNum = 0xF;
    }
    enterScrNum = scrNum;
    midScrNum = midNum;
    let dialogEnter = document.getElementById("dialogEnter");
    if (dialogEnter?.classList.contains("hidden")) {
        dialogEnter.classList.remove("hidden");
    }
    else {
        dialogEnter.classList.add("hidden");
        return;
    }
}
function btnEnterCancel_onclick() {
    let dialogEnter = document.getElementById("dialogEnter");
    if (dialogEnter?.classList.contains("hidden")) {
        dialogEnter.classList.remove("hidden");
    }
    else {
        dialogEnter.classList.add("hidden");
        return;
    }
}
function btnBGCancel_onclick() {
    let dialogBG = document.getElementById("dialogBG");
    dialogBG.classList.add("hidden");
}
function selBG_onchange() {
    let val = safeParseInt(this.value);
    let bgAddr;
    switch (val) {
        case 0:
            bgAddr = 0x0CD900;
            break;
        case 1:
            bgAddr = 0x0CDAB9;
            break;
        case 2:
            bgAddr = 0x0CDC71;
            break;
        case 3:
            bgAddr = 0x0CDD44;
            break;
        case 4:
            bgAddr = 0x0CDE54;
            break;
        case 5:
            bgAddr = 0x0CDF59;
            break;
        case 6:
            bgAddr = 0x0CE103;
            break;
        case 7:
            bgAddr = 0x0CE472;
            break;
        case 8:
            bgAddr = 0x0CE674;
            break;
        case 9:
            bgAddr = 0x0CE684;
            break;
        case 10:
            bgAddr = 0x0CE7C0;
            break;
        case 11:
            bgAddr = 0x0CE8EE;
            break;
        case 12:
            bgAddr = 0x0CE8FE;
            break;
        case 13:
            bgAddr = 0x0CEC82;
            break;
        case 14:
            bgAddr = 0x0CEF80;
            break;
        case 15:
            bgAddr = 0x0CF175;
            break;
        case 16:
            bgAddr = 0x0CF45A;
            break;
        case 17:
        default:
            bgAddr = bgPointer;
            break;
    }
    let bgp;
    if (defaultBGList.indexOf(bgAddr) != -1) {
        bgp = getBGPage(bgAddr);
    }
    else {
        bgp = bgPage;
    }
    let bgData = loadBG(bgAddr);
    let bgBitmap = getBG(bgData, bgp);
    const canvas = document.getElementById("bgPreview");
    canvas.width = 32 * 16;
    canvas.height = 32 * 16;
    canvas.style.backgroundColor = `rgb(${bgColor.r}, ${bgColor.g}, ${bgColor.b})`;
    let ctx = canvas.getContext("2d");
    try {
        ctx.putImageData(bgBitmap, 0, 0);
    }
    catch (e) {
    }
}
function btnBGOK_onclick() {
    let dialogBG = document.getElementById("dialogBG");
    dialogBG.classList.add("hidden");
    const selBG = document.getElementById("selBG");
    let bgNum = safeParseInt(selBG.value);
    let bgAddr;
    switch (bgNum) {
        case 0:
            bgAddr = 0x0CD900;
            break;
        case 1:
            bgAddr = 0x0CDAB9;
            break;
        case 2:
            bgAddr = 0x0CDC71;
            break;
        case 3:
            bgAddr = 0x0CDD44;
            break;
        case 4:
            bgAddr = 0x0CDE54;
            break;
        case 5:
            bgAddr = 0x0CDF59;
            break;
        case 6:
            bgAddr = 0x0CE103;
            break;
        case 7:
            bgAddr = 0x0CE472;
            break;
        case 8:
            bgAddr = 0x0CE674;
            break;
        case 9:
            bgAddr = 0x0CE684;
            break;
        case 10:
            bgAddr = 0x0CE7C0;
            break;
        case 11:
            bgAddr = 0x0CE8EE;
            break;
        case 12:
            bgAddr = 0x0CE8FE;
            break;
        case 13:
            bgAddr = 0x0CEC82;
            break;
        case 14:
            bgAddr = 0x0CEF80;
            break;
        case 15:
            bgAddr = 0x0CF175;
            break;
        case 16:
            bgAddr = 0x0CF45A;
            break;
        case 17:
        default:
            bgAddr = bgPointer;
            break;
    }
    if (bgAddr == 0) {
        return;
    }
    bgPointer = bgAddr;
    if (defaultBGList.indexOf(bgAddr) != -1) {
        bgPage = getBGPage(bgPointer);
    }
    bgData = loadBG(bgPointer);
    renderBG();
}
function btnSwitchBG_onclick() {
    let dialogBG = document.getElementById("dialogBG");
    if (dialogBG?.classList.contains("hidden")) {
        dialogBG.classList.remove("hidden");
    }
    else {
        dialogBG.classList.add("hidden");
        return;
    }
    const selBG = document.getElementById("selBG");
    let bgNum;
    switch (bgPointer) {
        case 0x0CD900:
            bgNum = 0;
            break;
        case 0x0CDAB9:
            bgNum = 1;
            break;
        case 0x0CDC71:
            bgNum = 2;
            break;
        case 0x0CDD44:
            bgNum = 3;
            break;
        case 0x0CDE54:
            bgNum = 4;
            break;
        case 0x0CDF59:
            bgNum = 5;
            break;
        case 0x0CE103:
            bgNum = 6;
            break;
        case 0x0CE472:
            bgNum = 7;
            break;
        case 0x0CE674:
            bgNum = 8;
            break;
        case 0x0CE684:
            bgNum = 9;
            break;
        case 0x0CE7C0:
            bgNum = 10;
            break;
        case 0x0CE8EE:
            bgNum = 11;
            break;
        case 0x0CE8FE:
            bgNum = 12;
            break;
        case 0x0CEC82:
            bgNum = 13;
            break;
        case 0x0CEF80:
            bgNum = 14;
            break;
        case 0x0CF175:
            bgNum = 15;
            break;
        case 0x0CF45A:
            bgNum = 16;
            break;
        case 0:
        default:
            bgNum = 17;
    }
    selBG.value = bgNum.toString();
    if (isLayer2) {
        selBG.disabled = true;
        btnBGOK.disabled = true;
    }
    else {
        selBG.disabled = false;
        btnBGOK.disabled = false;
    }
    selBG.onchange();
}
function btnEnter_onclick() {
    let dialogEnter = document.getElementById("dialogEnter");
    if (dialogEnter?.classList.contains("hidden")) {
        dialogEnter.classList.remove("hidden");
    }
    else {
        dialogEnter.classList.add("hidden");
        return;
    }
    const scrNum = document.getElementById("scrNum");
    const midNum = document.getElementById("midNum");
    const selMarioAction = document.getElementById("selMarioAction");
    const selEnterX = document.getElementById("selEnterX");
    const selEnterY = document.getElementById("selEnterY");
    const selEnterFG = document.getElementById("selEnterFG");
    const selEnterBG = document.getElementById("selEnterBG");
    scrNum.value = hex(enterScrNum);
    midNum.value = hex(midScrNum);
    selMarioAction.value = enterAction.toString();
    selEnterX.value = enterX.toString();
    selEnterY.value = enterY.toString();
    selEnterFG.value = enterFG.toString();
    selEnterBG.value = enterBG.toString();
}
function btnSprHeader_onclick() {
    let dialogSprHeader = document.getElementById("dialogSprHeader");
    if (dialogSprHeader?.classList.contains("hidden")) {
        dialogSprHeader.classList.remove("hidden");
    }
    else {
        dialogSprHeader.classList.add("hidden");
        return;
    }
    const selSprMemory = document.getElementById("selSprMemory");
    const chkSprBuoy1 = document.getElementById("chkSprBuoy1");
    const chkSprBuoy2 = document.getElementById("chkSprBuoy2");
    selSprMemory.value = sprMemory.toString();
    if (buoyancy) {
        chkSprBuoy1.checked = true;
    }
    else {
        chkSprBuoy1.checked = false;
    }
    if (buoyancy2) {
        chkSprBuoy2.checked = true;
    }
    else {
        chkSprBuoy2.checked = false;
    }
}
function btnOtherHeader_onclick() {
    let dialogOtherHeader = document.getElementById("dialogOtherHeader");
    if (dialogOtherHeader?.classList.contains("hidden")) {
        dialogOtherHeader.classList.remove("hidden");
    }
    else {
        dialogOtherHeader.classList.add("hidden");
        return;
    }
    const selLayer2ScrollingRate = document.getElementById("selLayer2ScrollingRate");
    const selLayer3Option = document.getElementById("selLayer3Option");
    const checkVerticalLevelPositioning = document.getElementById("checkVerticalLevelPositioning");
    const checkVerticalLevelUnknown = document.getElementById("checkVerticalLevelUnknown");
    const checkDisableNoYoshi = document.getElementById("checkDisableNoYoshi");
    selLayer2ScrollingRate.value = layer2ScrollSetting.toString();
    selLayer3Option.value = layer3Setting.toString();
    if (verticalLevelPositioning) {
        checkVerticalLevelPositioning.checked = true;
    }
    else {
        checkVerticalLevelPositioning.checked = false;
    }
    if (verticalLevelUnknown) {
        checkVerticalLevelUnknown.checked = true;
    }
    else {
        checkVerticalLevelUnknown.checked = false;
    }
    if (disableNoYoshi) {
        checkDisableNoYoshi.checked = true;
    }
    else {
        checkDisableNoYoshi.checked = false;
    }
}
function btnGFX_onclick() {
    let dialogGFX = document.getElementById("dialogGFX");
    if (dialogGFX?.classList.contains("hidden")) {
        dialogGFX.classList.remove("hidden");
    }
    else {
        dialogGFX.classList.add("hidden");
        return;
    }
    const selFGBGGFX = document.getElementById("selFGBGGFX");
    const selSprGFX = document.getElementById("selSprGFX");
    selFGBGGFX.value = fgbgGFX.toString();
    selSprGFX.value = sprGFX.toString();
}
function getObjImage(obj) {
    if ((obj.objNum === 0x22 || obj.objNum === 0x23)) {
        const data = getMap16TileImg(obj.tileNum);
        const width = obj.tileWidth;
        const height = obj.tileHeight;
        const canvas = document.createElement("canvas");
        canvas.width = width * 16;
        canvas.height = height * 16;
        const ctx = canvas.getContext("2d");
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                ctx.putImageData(data, j * 16, i * 16);
            }
        }
        return canvas.toDataURL('image/png');
    }
    else if (obj.objNum === 0x27 || obj.objNum === 0x29) {
        if (obj.mode === 0) {
            const data = getMap16TileImg(obj.tileNum);
            const width = obj.tileWidth;
            const height = obj.tileHeight;
            const canvas = document.createElement("canvas");
            canvas.width = width * 16;
            canvas.height = height * 16;
            const ctx = canvas.getContext("2d");
            for (let i = 0; i < height; i++) {
                for (let j = 0; j < width; j++) {
                    ctx.putImageData(data, j * 16, i * 16);
                }
            }
            return canvas.toDataURL('image/png');
        }
        else if (obj.mode === 1) {
            const canvas = document.createElement("canvas");
            const tilenum = obj.tileNum;
            const width = getObjWidth(obj);
            const height = getObjHeight(obj);
            const leftTop = obj.tileNum;
            canvas.width = width * 16;
            canvas.height = height * 16;
            const ctx = canvas.getContext("2d");
            for (let i = 0; i < height; i++) {
                for (let j = 0; j < width; j++) {
                    let index = leftTop + (i * 16) + j;
                    const img = getMap16TileImg(index);
                    ctx.putImageData(img, j * 16, i * 16);
                }
            }
            return canvas.toDataURL('image/png');
        }
        else if (obj.mode === 2) {
            const canvas = document.createElement("canvas");
            const tilenum = obj.tileNum;
            const width = obj.tileWidth;
            const height = obj.tileHeight;
            const leftTop = obj.tileNum;
            canvas.width = width * 16;
            canvas.height = height * 16;
            const ctx = canvas.getContext("2d");
            const width16 = obj.width16 + 1;
            const height16 = obj.height16 + 1;
            for (let i = 0; i < height; i++) {
                for (let j = 0; j < width; j++) {
                    let index = leftTop + ((i % height16) * 16) + (j % width16);
                    const img = getMap16TileImg(index);
                    ctx.putImageData(img, j * 16, i * 16);
                }
            }
            return canvas.toDataURL('image/png');
        }
        else if (obj.mode === 3) {
            if (obj.submode === 0 || obj.submode === 1) {
                const canvas = document.createElement("canvas");
                const tilenum = obj.tileNum;
                const width = getObjWidth(obj);
                const height = getObjHeight(obj);
                const leftTop = obj.tileNum;
                canvas.width = width * 16;
                canvas.height = height * 16;
                const ctx = canvas.getContext("2d");
                const width16 = obj.width16 + 1;
                const height16 = obj.height16 + 1;
                for (let i = 0; i < height; i++) {
                    for (let j = 0; j < width; j++) {
                        let index = leftTop + ((i % height16) * 16) + (j % width16);
                        const img = getMap16TileImg(index);
                        ctx.putImageData(img, j * 16, i * 16);
                    }
                }
                return canvas.toDataURL('image/png');
            }
        }
    }
    return getObjImg(obj.objNum, obj.settings, tileset);
}
function getObjWidth(obj) {
    if (obj.objNum === 0x22 || obj.objNum === 0x23) {
        return obj.tileWidth;
    }
    if (obj.objNum === 0x27 || obj.objNum === 0x29) {
        if (obj.mode === 3) {
            if (obj.submode === 0) {
                return obj.tileWidth + 1;
            }
            else if (obj.submode === 1) {
                return obj.tileWidth + 1;
            }
        }
        return obj.tileWidth;
    }
    return getWidth(obj.objNum, obj.settings, tileset);
}
function getObjHeight(obj) {
    if (obj.objNum === 0x22 || obj.objNum === 0x23) {
        return obj.tileHeight;
    }
    if (obj.objNum == 0x27 || obj.objNum == 0x29) {
        if (obj.mode === 3) {
            if (obj.submode === 0) {
                return obj.tileHeight + 1;
            }
            else if (obj.submode === 1) {
                return obj.tileHeight + 1;
            }
        }
        return obj.tileHeight;
    }
    return getHeight(obj.objNum, obj.settings, tileset);
}
function create_object_view(obj, index, type = "layer1") {
    const myObject = document.createElement("div");
    let img;
    let screen, x, y;
    let num;
    let data;
    myObject.style.width = '16px';
    myObject.style.height = '16px';
    if (type === "layer1" || type === "layer2") {
        num = obj.objNum;
        data = obj.settings;
        img = getObjImage(obj);
        screen = obj.screen;
        x = getX(obj);
        y = getY(obj);
        if (type === "layer1") {
            myObject.className = "object layer1";
            myObject.style.backgroundColor = 'chartreuse';
            myObject.style.zIndex = (index + 0x800000) + "";
        }
        else {
            myObject.className = "object layer2";
            myObject.style.backgroundColor = 'red';
            myObject.style.zIndex = (index + 0x000000) + "";
        }
        myObject.style.width = (getObjWidth(obj) * 16) + 'px';
        myObject.style.height = (getObjHeight(obj) * 16) + 'px';
        myObject.onmousedown = obj_onmousedown;
        myObject.onmouseup = obj_onmouseup;
        myObject.onkeydown = obj_onkeydown;
        myObject.ondblclick = obj_ondblclick;
    }
    else if (type === "sprite") {
        const spr = obj;
        num = spr.spriteID;
        data = spr.extra;
        img = getSprImg(num, data);
        screen = spr.screenNum;
        x = spr.xPosition;
        y = spr.yPosition;
        myObject.className = "sprite";
        myObject.style.backgroundColor = 'lightblue';
        myObject.style.zIndex = (0x1800000).toString();
        myObject.ondblclick = spr_ondblclick;
        myObject.onkeydown = spr_onkeydown;
        myObject.onmousedown = obj_onmousedown;
        myObject.onmouseup = obj_onmouseup;
    }
    else {
        throw new TypeError();
    }
    if (isVertical) {
        myObject.style.top = ((256 * screen) + (x * 16)) + 'px';
        myObject.style.left = (y * 16) + 'px';
    }
    else {
        myObject.style.top = (y * 16) + 'px';
        myObject.style.left = ((256 * screen) + (x * 16)) + 'px';
    }
    myObject.title = hex(num) + "\n" + hex(data);
    myObject.setAttribute("data-index", index.toString());
    myObject.tabIndex = -1;
    myObject.style.position = "absolute";
    myObject.style.fontSize = '8px';
    if (img) {
        myObject.style.border = "";
        myObject.style.backgroundColor = '';
        myObject.style.backgroundImage = `url(${img})`;
    }
    return myObject;
}
function render() {
    /* Rendering */
    // create view
    let stage;
    stage = document.querySelector("#stage");
    if (stage) {
        document.querySelector("#main").removeChild(stage);
    }
    stage = document.createElement("div");
    stage.id = "stage";
    stage.tabIndex = -1;
    stage.style.position = "relative";
    stage.style.backgroundColor = `rgb(${bgColor.r}, ${bgColor.g}, ${bgColor.b})`;
    if (isVertical) {
        main.style.overflowX = "hidden";
        main.style.overflowY = "show";
        stage.style.height = (256 * (screenLength + 1)) + 'px';
        stage.style.width = (16 * 32) + 'px';
    }
    else {
        main.style.overflowX = "show";
        main.style.overflowY = "hidden";
        stage.style.height = (16 * 27) + 'px';
        stage.style.width = (256 * (screenLength + 1)) + 'px';
    }
    stage.onmousedown = stage_onmousedown;
    stage.onmousemove = stage_onmousemove;
    stage.onmouseup = stage_onmouseup;
    stage.onkeydown = stage_onkeydown;
    document.querySelector("#main").appendChild(stage);
    // render layer 1
    for (let i = 0; i < layer1Data.length; i++) {
        const obj = layer1Data[i];
        const myObject = create_object_view(obj, i, "layer1");
        stage.appendChild(myObject);
    }
    // render layer 2
    for (let i = 0; i < layer2Data.length; i++) {
        const obj = layer2Data[i];
        const myObject = create_object_view(obj, i, "layer2");
        stage.appendChild(myObject);
    }
    // render sprite
    for (let i = 0; i < sprites.length; i++) {
        const spr = sprites[i];
        const myObject = create_object_view(spr, i, "sprite");
        stage.appendChild(myObject);
    }
    btnSwitchBG.click();
    btnSwitchBG.click();
    btn16x16.click();
    btn16x16.click();
    btn8x8.click();
    btn8x8.click();
    renderBG();
}
function loadROM(lvlNum = 0x105, fileData) {
    // check the rom file size
    if (!checkRomFileSize(fileData, true)) {
        throw new Error("Wrong file size.");
    }
    // detect the rom type
    const fileType = detectRomType(fileData, true);
    if (fileType === "Invalid") {
        throw new Error("Unknown ROM Type");
    }
    // check the game title
    let gameTitle;
    gameTitle = String.fromCharCode(...fileData.slice(snes2pc(0x00ffc0, fileType), snes2pc(0x00ffc0, fileType) + 21));
    if (gameTitle !== "SUPER MARIOWORLD     ") {
        throw new Error("Wrong game title");
    }
    // if rom file is small then expand the rom.
    if (fileData.length < 1048576) {
        let result;
        try {
            result = expand(fileData, 1048576, false, "", false, true);
        }
        catch (e) {
            throw new Error("Can't expand the ROM.");
        }
        fileData = new Uint8Array(result);
    }
    let lmModified;
    /* Check Lunar Magic */
    if (fileData[snes2pc(0x0FF0A0, fileType)] === 0x4C) {
        lmModified = true;
    }
    else {
        lmModified = false;
    }
    let lunarMagicVer;
    // Get the Lunar Magic Version
    if (lmModified) {
        const signature = "Lunar Magic Version ";
        const str = String.fromCharCode(...(fileData.slice(snes2pc(0x0FF0A0, fileType), snes2pc(0x0FF0A0, fileType) + signature.length)));
        if (str !== signature) {
            throw new Error("Not valid ROM.");
        }
        let verStr = "";
        let flag = false;
        for (let i = snes2pc(0x0FF0A0, fileType) + signature.length;; i++) {
            if (fileData[i] === " ".charCodeAt(0)) {
                break;
            }
            if ("0".charCodeAt(0) <= fileData[i] && fileData[i] <= "9".charCodeAt(0)) {
                verStr += String.fromCharCode(fileData[i]);
            }
            else if (fileData[i] === ".".charCodeAt(0) && (!flag)) {
                verStr += String.fromCharCode(fileData[i]);
                flag = true;
            }
            else {
                throw new Error("Not valid ROM.");
            }
        }
        lunarMagicVer = parseFloat(verStr);
    }
    else {
        lunarMagicVer = parseFloat("0");
    }
    if (lmModified) {
        //throw new Error("Lunar Magic Modified ROM is not supproted yet.");
    }
    romType = fileType;
    isLMModified = lmModified;
    lmVer = lunarMagicVer;
    console.log("ROM Type: " + fileType);
    console.log("isLMModified: " + isLMModified);
    console.log("lmVer: " + lmVer);
    loadLevel(lvlNum);
}
function getOldGFXBypassList(index) {
    const ptr = 0x0FF200;
    const fg1 = read1(ptr + (index * 4) + 0);
    const bg1 = read1(ptr + (index * 4) + 1);
    const fg2 = read1(ptr + (index * 4) + 2);
    const fg3 = read1(ptr + (index * 4) + 3);
    return [fg1, bg1, fg2, fg3];
}
function loadLevel(lvlNum) {
    /* Get Layer1, Layer2, Sprite Data Pointer */
    layer1DataPointer = read3(layer1DatasTable + (3 * lvlNum));
    layer2DataPointer = read3(layer2DatasTable + (3 * lvlNum));
    let sprDataOffset, sprDataBank;
    sprDataOffset = read2(spriteDataTable + (2 * lvlNum));
    // if original smw
    if (!isLMModified) {
        sprDataBank = 0x07;
    }
    else {
        sprDataBank = read1(0x0EF100 + lvlNum);
    }
    spriteDataPointer = (sprDataBank << 16) | sprDataOffset;
    // check overflow.
    read3(layer1DataPointer);
    // if original smw
    /*
    if (!isLMModified) {
        if ((layer2DataPointer >>> 16) === 0xFF) {
            const realLayer2DataPointer = 0x0C0000 | (layer2DataPointer & 0xFFFF);
            read3(realLayer2DataPointer);
        }
    } else {
        if ((layer2DataPointer >>> 16) === 0xFF) {
            const realLayer2DataPointer = 0x0C0000 | (layer2DataPointer & 0xFFFF);
            read3(realLayer2DataPointer);
        }
        read3(layer2DataPointer);
    }
    */
    read3(spriteDataPointer);
    /* Get Level Header */
    let primaryLevelHeader;
    let secondaryLevelHeader;
    primaryLevelHeader = new Array(5);
    primaryLevelHeader[0] = read1(layer1DataPointer + 0);
    primaryLevelHeader[1] = read1(layer1DataPointer + 1);
    primaryLevelHeader[2] = read1(layer1DataPointer + 2);
    primaryLevelHeader[3] = read1(layer1DataPointer + 3);
    primaryLevelHeader[4] = read1(layer1DataPointer + 4);
    secondaryLevelHeader = new Array(4);
    secondaryLevelHeader[0] = read1(0x05F000 + lvlNum);
    secondaryLevelHeader[1] = read1(0x05F200 + lvlNum);
    secondaryLevelHeader[2] = read1(0x05F400 + lvlNum);
    secondaryLevelHeader[3] = read1(0x05F600 + lvlNum);
    secondaryLevelHeader[4] = 0;
    secondaryLevelHeader[5] = 0;
    secondaryLevelHeader[6] = 0;
    secondaryLevelHeader[7] = 0;
    if (isLMModified) {
        secondaryLevelHeader[4] = read1(0x05DE00 + lvlNum);
        if (lmVer >= 3.0) {
            secondaryLevelHeader[7] = read1(0x06FE00 + lvlNum);
            secondaryLevelHeader[6] = read1(0x06FC00 + lvlNum);
        }
        if (lmVer >= 3.40) {
            secondaryLevelHeader[5] = read1(0x06FA00 + lvlNum);
        }
    }
    /* Get Level Information */
    const lvlMode = ((primaryLevelHeader[1]) & 0b11111);
    if (lvlMode >= verticalList.length || lvlMode >= layer2List.length) {
        throw new Error("Level Mode is not valid.");
    }
    screenLength = ((primaryLevelHeader[0]) & 0b11111);
    backAreaColorNum = ((primaryLevelHeader[1] >>> 5) & 0b111);
    timer = (primaryLevelHeader[3] >>> 6);
    music = ((primaryLevelHeader[2] >>> 4) & 0b111);
    itemMemory = ((primaryLevelHeader[4] >>> 6) & 0b11);
    layer3Prior = ((primaryLevelHeader[2] >>> 7) & 0b1);
    verticalScrollSetting = ((primaryLevelHeader[4] >>> 4) & 0b11);
    layer2ScrollSetting = ((((primaryLevelHeader[5] >>> 6) & 0b1) << 4) | ((secondaryLevelHeader[0] >>> 4) & 0b1111));
    layer3Setting = (secondaryLevelHeader[1] >>> 6) & 0b11;
    verticalLevelPositioning = (secondaryLevelHeader[3] >>> 5) & 0b1;
    verticalLevelUnknown = (secondaryLevelHeader[3] >>> 6) & 0b1;
    disableNoYoshi = (secondaryLevelHeader[3] >>> 7) & 0b1;
    enterAction = (secondaryLevelHeader[1] >>> 3) & 0b111;
    enterScrNum = (secondaryLevelHeader[3] >>> 0) & 0b11111;
    midScrNum = (secondaryLevelHeader[2] >>> 4) & 0b1111;
    enterX = ((((secondaryLevelHeader[4] >>> 2) & 0b11) << 3) | (secondaryLevelHeader[1] >>> 0) & 0b111);
    enterY = (((secondaryLevelHeader[6] & 0b111111) << 4) | ((secondaryLevelHeader[0] >>> 0) & 0b1111));
    if (isLMModified && lmVer < 3.0) {
        enterX = ((((secondaryLevelHeader[4] >>> 3) & 0b1) << 3) | (secondaryLevelHeader[1] >>> 0) & 0b111);
        enterY = ((((secondaryLevelHeader[4] >>> 4) & 0b1) << 4) | ((secondaryLevelHeader[0] >>> 0) & 0b1111));
    }
    enterBG = (secondaryLevelHeader[2] >>> 0) & 0b11;
    enterFG = (secondaryLevelHeader[2] >>> 2) & 0b11;
    offset = ((((secondaryLevelHeader[6] >>> 6) & 1) << 4) | ((secondaryLevelHeader[2] >>> 0) & 0b1111));
    isVertical = !!(verticalList[lvlMode]);
    bgPalNum = ((primaryLevelHeader[0] >>> 5) & 0b111);
    fgPalNum = ((primaryLevelHeader[3]) & 0b111);
    spPalNum = ((primaryLevelHeader[3] >> 3) & 0b111);
    fgbgGFX = primaryLevelHeader[4] & 0b1111;
    sprGFX = primaryLevelHeader[2] & 0b1111;
    slippery = (secondaryLevelHeader[4] >>> 7) & 1;
    water = (secondaryLevelHeader[4] >>> 6) & 1;
    method2 = (secondaryLevelHeader[4] >>> 5) & 1;
    smartSpawnFlag = (secondaryLevelHeader[4] >>> 2) & 1;
    spriteSpawnRange = (secondaryLevelHeader[4] >>> 0) & 1;
    useSeparatelayer2ScrollRate = (secondaryLevelHeader[5] >>> 7) & 1;
    autoSetScrNumber = (secondaryLevelHeader[5] >>> 5) & 1;
    layer2VerticalScrollSetting = secondaryLevelHeader[5] & 0b11111;
    bgRelativeToFG = secondaryLevelHeader[6] >>> 7;
    bgfgIsRelativeToPlayer = secondaryLevelHeader[7] >>> 7;
    enterLeft = (secondaryLevelHeader[7] >>> 6) & 1;
    bgHeight = (secondaryLevelHeader[7] >>> 0) & 0b11111;
    levelNum = lvlNum;
    levelMode = lvlMode;
    editMode = "layer1";
    isBGEdited = false;
    levelMode = lvlMode;
    bypassedMusic = -1;
    isTimeBypassed = false;
    sprGFXindex = -1;
    fgbgGFXindex = -1;
    customPaletteAddr = 0;
    horizontalLevelMode = 0;
    showBottomRowOfTheLevel = 0;
    levelUsesEitherLayer2OrLayer3 = 0;
    // read horizontal level mode
    if (isLMModified && lmVer === 3.0) {
        // TB0MMMMM 
        const pointer = read3(read3(0x05D9A2) + 70) + lvlNum;
        const extHeader = read1(pointer);
        let zero;
        horizontalLevelMode = extHeader & 0b11111;
        showBottomRowOfTheLevel = (extHeader >>> 6) & 0b1;
        levelUsesEitherLayer2OrLayer3 = (extHeader >>> 7) & 0b1;
        zero = (extHeader >>> 5) & 0b1;
        console.log("horizontalLevelMode: " + horizontalLevelMode.toString(16));
        console.log("showBottomRowOfTheLevel: " + showBottomRowOfTheLevel.toString(16));
        if (zero !== 0) {
            throw new Error("extended header is not valid.");
        }
    }
    // read midway information
    midSlippery = 0;
    midWater = 0;
    separateMidway = 0;
    midScrNum = 0;
    midwayY = 0;
    midwayX = 0;
    midAction = 0;
    midBgfgIsRelativeToPlayer = 0;
    midwayFG = 0;
    midwayBG = 0;
    midOffset = 0;
    midEnterLeft = 0;
    midwayRedirect = 0;
    midwayRedirectLevelNum = 0;
    label: if (isLMModified && lmVer >= 2.20) {
        let pointer;
        try {
            pointer = read3(read3(0x05D9E4) + 0x0A);
        }
        catch (e) {
            break label;
        }
        const addr1 = pointer + (512 * 0) + lvlNum;
        const addr2 = pointer + (512 * 1) + lvlNum;
        const addr3 = pointer + (512 * 2) + lvlNum;
        const addr4 = pointer + (512 * 3) + lvlNum;
        let hdr1 = read1(addr1);
        let hdr2 = read1(addr2);
        let hdr3 = read1(addr3);
        let hdr4 = read1(addr4);
        if (lmVer < 3.0) {
            hdr4 = 0;
        }
        midSlippery = hdr1 >>> 7;
        midWater = (hdr1 >>> 6) & 0b1;
        if (lmVer >= 3.0) {
            separateMidway = (hdr1 >>> 5) & 0b1;
        }
        else {
            separateMidway = (hdr1 >>> 5) & 0b1;
        }
        midScrNum = midMidScrNum = (((hdr1 >>> 4) & 0b1) << 4) | (midScrNum & 0b1111);
        midwayY = (hdr2 >>> 4);
        midwayX = (hdr2 & 0b1111);
        if (lmVer >= 3.0) {
            midwayY = ((hdr4 & 0b111111) << 4) | midwayY;
            midwayX = (((hdr1 >>> 3) & 0b1) << 4) | midwayX;
        }
        else {
            midwayY = (((hdr1 >>> 3) & 0b1) << 4) | midwayY;
        }
        midAction = hdr1 & 0b111;
        midBgfgIsRelativeToPlayer = 0;
        if (lmVer >= 3.0) {
            midBgfgIsRelativeToPlayer = hdr3 >>> 7;
        }
        midwayFG = (hdr3 >>> 2) & 0b11;
        midwayBG = (hdr3 >>> 0) & 0b11;
        midOffset = hdr3 & 0b1111;
        if (lmVer >= 3.0) {
            midOffset |= ((hdr4 >>> 6) & 0b1) << 4;
        }
        midEnterLeft = 0;
        if (lmVer >= 3.0) {
            midEnterLeft = (hdr3 >>> 6) & 1;
        }
        midwayRedirect = 0;
        if (lmVer >= 3.0) {
            midwayRedirect = (hdr3 >>> 5) & 0b1;
        }
        midwayRedirectLevelNum = 0;
        if (midwayRedirect) {
            midwayRedirectLevelNum = ((hdr3 & 0b1) << 8) | hdr2;
        }
    }
    if (fgbgGFX > 15) {
        fgbgGFX = 0;
    }
    if (sprGFX > 15) {
        sprGFX = 0;
    }
    // read level's animation settings
    if (isLMModified && lmVer >= 1.80) {
        const levelAnimationSettings = read1(0x03FE00 + levelNum);
        disableOrgLevelPalAni = (levelAnimationSettings >>> 7) & 1;
        disableOrgLevelAni = (levelAnimationSettings >>> 6) & 1;
        disableCustomLevelAni = (levelAnimationSettings >>> 5) & 1;
        disableCustomGlobalAni = (levelAnimationSettings >>> 4) & 1;
    }
    else {
        disableOrgLevelPalAni = 0;
        disableOrgLevelAni = 0;
        disableCustomLevelAni = 0;
        disableCustomGlobalAni = 0;
    }
    /* Load Palette */
    // get palette
    pal = getPalette(bgPalNum, fgPalNum, spPalNum, !!disableOrgLevelPalAni);
    // Get back area color
    bgColor = getBackAreaColor(backAreaColorNum);
    // get custom palette
    if (isLMModified) {
        customPaletteAddr = read3(0x0EF600 + (3 * lvlNum));
        if (customPaletteAddr !== 0 && customPaletteAddr !== 0xFFFFFF) {
            pal = getCustomPalette(customPaletteAddr, !!disableOrgLevelPalAni);
            bgColor = getCustomBackAreaColor(customPaletteAddr);
        }
    }
    /* Load Graphics */
    loadGraphics();
    /* Load Map16 */
    load16x16();
    /* Load ExAnimation */
    loadExAnimations();
    renderExAnimation();
    /* get secondary exits */
    secondExits = getSecondaryExits();
    /* Get Layer 2 Objects */
    if (isLMModified) {
        const header = read1(0x0EF310 + lvlNum);
        const v = (header >>> 3) & 0b1;
        const c = (header >>> 1) & 0b1;
        if (v === 0 && c === 0) {
            isLayer2 = true;
        }
        else {
            isLayer2 = false;
        }
        isLayer2 = (layer2List[levelMode] == 1);
    }
    else {
        isLayer2 = (layer2List[levelMode] == 1);
    }
    bgPointer = 0;
    bgPage = 0;
    if (!isLayer2) {
        if (!isLMModified) {
            if ((layer2DataPointer >>> 16) == 0xFF) {
                bgPointer = (0x0C0000 | (layer2DataPointer & 0xFFFF));
                bgPage = getBGPage(bgPointer);
                layer2DataPointer = 0;
            }
        }
        else {
            let header = fileData[snes2pc(0x0EF310 + lvlNum)];
            let type = (header >>> 1) & 0b1;
            let flag = (header >>> 2) & 0b1;
            let nibble = (header >>> 4) & 0b1111;
            if ((layer2DataPointer >>> 16) == 0xFF) {
                // if default BG then
                bgPointer = (0x0C0000 | (layer2DataPointer & 0xFFFF));
                bgPage = getBGPage(bgPointer);
                layer2DataPointer = 0;
            }
            else {
                bgPointer = layer2DataPointer;
                bgPage = nibble;
                layer2DataPointer = 0;
            }
        }
    }
    // get background
    bgData = loadBG(bgPointer);
    // Layer 2
    if (layer2DataPointer != 0) {
        [layer2Data] = loadObjects(lvlNum, layer2DataPointer);
    }
    else {
        layer2Data = [];
    }
    /* Get Layer 1 Objects */
    [layer1Data, exits] = loadObjects(lvlNum, layer1DataPointer);
    // adjust for original smw.
    if (!isLMModified) {
        if (exits.length != 0 && exits[exits.length - 1].isSecond) {
            for (let i = 0; i < exits.length; i++) {
                exits[i].isSecond = 1;
            }
        }
    }
    /* Get sprite Data */
    loadSprites();
    /* Render */
    render();
    return true;
}
function index2index(index) {
    const rem = index % 0x80;
    return rem;
}
function index2page(index) {
    const div = intdiv(index, 0x80);
    switch (div) {
        case 0:
            return fg1bmp;
        case 1:
            return fg2bmp;
        case 2:
            return bgbmp;
        case 3:
            return fg3bmp;
        case 4:
            return bg2bmp;
        case 5:
            return bg3bmp;
        case 6:
            throw new Error();
        case 7:
            throw new Error();
        case 8:
            return sp1bmp;
        case 9:
            return sp2bmp;
        case 10:
            return sp3bmp;
        case 11:
            return sp4bmp;
    }
    throw new Error();
}
function exAniIndex2div(index) {
    if (0x600 <= index && index <= 0x77F) {
        return index - 0x600;
    }
    else if (0x780 <= index && index <= 0x857) {
        if (index >= 0x800) {
            throw new Error("undefined");
        }
        const value = index - 0x780;
        return value;
    }
    else if (0x900 <= index && index <= 0xBE7) {
        return index - 0x900;
    }
    else {
        throw new Error();
    }
}
function exAniIndex2gfx(index) {
    if (0x600 <= index && index <= 0x77F) {
        return anibmp;
    }
    else if (0x780 <= index && index <= 0x857) {
        if (index < 0x800)
            return ani2bmp;
        throw new Error("undefined");
    }
    else if (0x900 <= index && index <= 0xBE7) {
        return mariobmp;
    }
    else {
        throw new Error();
    }
}
function renderExAnimation() {
    if (!isLMModified)
        return;
    let allAnis;
    allAnis = [globalAnis, levelAnis];
    if (disableCustomLevelAni && disableCustomGlobalAni) {
        allAnis = [];
    }
    else if (disableCustomGlobalAni) {
        allAnis = [levelAnis];
    }
    else if (disableCustomLevelAni) {
        allAnis = [globalAnis];
    }
    for (let i = 0; i < allAnis.length; i++) {
        let anis = allAnis[i];
        for (let j = 0; j < anis.length; j++) {
            const ani = anis[j];
            const type = ani.type;
            if (type < 0x13) {
                if (ani.vramDest >= 0x1C00) {
                    continue;
                }
                if (ani.frameData[0] >= 0x10000) {
                    continue;
                }
                /*
                if (0x900 <= ani.frameData[0] && ani.frameData[0] <= 0xBE7) {
                    continue;
                }
                */
                let count;
                switch (type) {
                    case 0:
                        break;
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                    case 6:
                    case 7:
                    case 8:
                        count = type;
                        for (let i = 0; i < count; i++) {
                            const fromIndex = exAniIndex2div(ani.frameData[0] + i);
                            const toIndex = index2index(ani.vramDest + i);
                            const srcGfx = exAniIndex2gfx(ani.frameData[0] + i);
                            const destGfx = index2page(ani.vramDest + i);
                            destGfx[toIndex] = srcGfx[fromIndex];
                        }
                        break;
                    case 9:
                    case 10:
                    case 11:
                    case 12:
                    case 13:
                    case 14:
                        count = 8 + (4 * (type - 8));
                        for (let i = 0; i < count; i++) {
                            const fromIndex = exAniIndex2div(ani.frameData[0] + i);
                            const toIndex = index2index(ani.vramDest + i);
                            const srcGfx = exAniIndex2gfx(ani.frameData[0] + i);
                            const destGfx = index2page(ani.vramDest + i);
                            destGfx[toIndex] = srcGfx[fromIndex];
                        }
                        break;
                    case 16:
                        count = 2;
                        for (let i = 0; i < count; i++) {
                            const fromIndex = exAniIndex2div(ani.frameData[0] + i);
                            const srcGfx = exAniIndex2gfx(ani.frameData[0] + i);
                            const toIndex = index2index(ani.vramDest + (i * 16));
                            const destGfx = index2page(ani.vramDest + (i * 16));
                            destGfx[toIndex] = srcGfx[fromIndex];
                        }
                        break;
                    case 17:
                        count = 4;
                        for (let i = 0; i < count; i++) {
                            const fromIndex = exAniIndex2div(ani.frameData[0] + i);
                            const srcGfx = exAniIndex2gfx(ani.frameData[0] + i);
                            const toIndex = index2index(ani.vramDest + (i % 2) + (intdiv(i, 2) * 16));
                            const destGfx = index2page(ani.vramDest + (i % 2) + (intdiv(i, 2) * 16));
                            destGfx[toIndex] = srcGfx[fromIndex];
                        }
                        break;
                    case 18:
                        count = 8;
                        for (let i = 0; i < count; i++) {
                            const fromIndex = exAniIndex2div(ani.frameData[0] + i);
                            const srcGfx = exAniIndex2gfx(ani.frameData[0] + i);
                            const toIndex = index2index(ani.vramDest + (i % 4) + (intdiv(i, 4) * 16));
                            const destGfx = index2page(ani.vramDest + (i % 4) + (intdiv(i, 4) * 16));
                            destGfx[toIndex] = srcGfx[fromIndex];
                        }
                        break;
                    default:
                        break;
                }
            }
            else if (0x13 <= type && type <= 0x13 + 8) {
                let numColor = ani.numColor + 1;
                if (numColor === 1) {
                    const color = ani.frameData[0] & 32767;
                    const r = ((color >>> 0) & 0b11111) * 8;
                    const g = ((color >>> 5) & 0b11111) * 8;
                    const b = ((color >>> 10) & 0b11111) * 8;
                    const where = ani.palDest;
                    const wherex = where % 16;
                    const wherey = intdiv(where, 16);
                    if (0x13 + 3 <= type && type <= 0x13 + 3 + 1) {
                        bgColor.r = r;
                        bgColor.g = g;
                        bgColor.b = b;
                    }
                    else {
                        pal[wherey][wherex].r = r;
                        pal[wherey][wherex].g = g;
                        pal[wherey][wherex].b = b;
                    }
                }
            }
        }
    }
}
function loadExAnimations() {
    levelAnis = [];
    globalAnis = [];
    if (isLMModified && lmVer >= 1.62) {
        let globalAnisPointer;
        let lvlAnisPointer;
        try {
            globalAnisPointer = read1(read3(0x0583AE) + 0x5C) << 8 + (read2(read3(0x0583AE) + 0x65));
        }
        catch (e) {
            globalAnisPointer = 0;
        }
        try {
            lvlAnisPointer = (read3(read3(0x0583ae) + 0xEA) + 3 * levelNum);
        }
        catch (e) {
            lvlAnisPointer = 0;
        }
        if (lmVer >= 1.80 && globalAnisPointer && read2(read3(0x0583ae) + 0x5B) !== 0) {
            loadExAnimation(globalAnisPointer, globalAnis);
        }
        if (lvlAnisPointer && read1(lvlAnisPointer + 1) !== 0) {
            loadExAnimation(lvlAnisPointer, levelAnis);
        }
    }
}
function convertAddr2index(index, aniType = 0) {
    if (aniType < 0x13) {
        if (0x7D00 <= index && index <= 0xACFF) {
            const n = ((index - 0x7D00)) / 0x20;
            return 0x600 + n;
        }
        else if (0xAD00 <= index && index <= 0xC7FF) {
            const n = ((index - 0xAD00)) / 0x20;
            return 0x780 + n;
        }
        else if (0x2000 <= index && index <= 0x7CFF) {
            const n = ((index - 0x2000)) / 0x20;
            return 0x900 + n;
        }
        else {
            return index;
        }
    }
    return index;
}
function convertDestAddr2index(index, aniType = 0) {
    if (aniType < 0x13) {
        if (0x0000 <= index && index <= 0x2FFF) {
            const n = (index - 0x0000) / 0x10;
            return n + 0x0;
        }
        else if (0x6000 <= index && index <= 0x7FFF) {
            const n = (index - 0x6000) / 0x10;
            return n + 0x400;
        }
        else if (0x4000 <= index && index <= 0x4FFF) {
            const n = (index - 0x4000) / 0x8;
            return n + 0x1C00;
        }
        else {
            return index;
        }
    }
    return index;
}
function loadExAnimation(pointer, anis) {
    const tbl = read3(pointer);
    const highestUsedAniSlot = read1(tbl + 0) - 1;
    const alternateGFX = read1(tbl + 1);
    const whichCustomTriggersStartUninitialized = read2(tbl + 2);
    const InitialStatesForEachCustomTriggerWhenInitialized = read2(tbl + 4);
    const whichManualTriggersAreInitialized = read2(tbl + 6);
    let count = 0;
    for (let i = 0; i < 16; i++) {
        const bit = (whichManualTriggersAreInitialized >> i) & 1;
        if (bit === 1) {
            count++;
        }
    }
    for (let i = 0; i <= highestUsedAniSlot; i++) {
        const index = read2(tbl + 8 + count + (i * 2));
        if (index !== 0) {
            const pointer = (tbl + 8 + count + index);
            const aniType = read1(pointer + 0);
            const trigger = read1(pointer + 1);
            const frames = read1(pointer + 2) + 1;
            const vramDest = read2(pointer + 3);
            const palDest = read1(pointer + 3);
            const numColor = read1(pointer + 4);
            const useLevelsAlterGFX = frames >>> 7;
            const frameData = [];
            const dest = convertDestAddr2index(vramDest, aniType);
            for (let j = 0; j < frames; j++) {
                const data = read2(pointer + 5 + (j * 2));
                const index = convertAddr2index(data, aniType);
                frameData.push(index);
            }
            const ani = new ExAni();
            ani.used = 1;
            ani.type = aniType;
            ani.trigger = trigger;
            ani.frames = frames;
            ani.palDest = palDest;
            ani.numColor = numColor;
            ani.vramDest = dest;
            ani.useLevelsAlterGFX = useLevelsAlterGFX;
            ani.frameData = frameData;
            anis.push(ani);
        }
        else {
            anis.push(new ExAni());
        }
    }
}
function loadObjects(lvlNum, layerDataPointer) {
    const objList = new Array();
    let pointer = (layerDataPointer + 5);
    let currentScreen = 0;
    let currentVScreen = 0;
    const exits = [];
    loop: while (fileData[snes2pc(pointer)] != 0xFF) {
        let xposition;
        let yposition;
        let settings;
        let objNum;
        xposition = (fileData[snes2pc(pointer + 1)] & 0b1111);
        yposition = (fileData[snes2pc(pointer + 0)] & 0b11111);
        settings = (fileData[snes2pc(pointer + 2)]);
        objNum = (((fileData[snes2pc(pointer + 0)] >>> 5) & 0b11) << 4) | (fileData[snes2pc(pointer + 1)] >>> 4);
        if (((!(objNum === 0 && ((settings === 0x01) || (settings === 0)))) && (objNum < 0x22 || objNum > 0x2C)) && (!(objNum === 0 && settings < 0x10))) {
            let newscreen;
            newscreen = (fileData[snes2pc(pointer + 0)] >>> 7);
            if (newscreen) {
                currentScreen++;
            }
            let newObj;
            newObj = new Obj(objNum, xposition, yposition, settings);
            newObj.screen = currentScreen;
            objList.push(newObj);
        }
        else {
            if (objNum === 0) {
                if (settings == 0x00) {
                    // exits
                    let exit;
                    let scrNumber, isSecond, destLevel;
                    let isWaterMid, LMflag;
                    scrNumber = fileData[snes2pc(pointer + 0)] & 0b11111;
                    isSecond = (fileData[snes2pc(pointer + 1)] >>> 1) & 1;
                    destLevel = ((fileData[snes2pc(pointer + 1)] & 1) << 8) | fileData[snes2pc(pointer + 3)];
                    isWaterMid = (fileData[snes2pc(pointer + 1)] >>> 3) & 1;
                    LMflag = (fileData[snes2pc(pointer + 1)] >>> 2) & 1;
                    if (!isLMModified) {
                        destLevel = (((lvlNum >>> 8) & 1) << 8) | fileData[snes2pc(pointer + 3)];
                    }
                    exit = {
                        scrNumber,
                        isSecond,
                        destLevel,
                        isWaterMid,
                        LMflag,
                    };
                    exits.push(exit);
                    pointer += 4;
                    continue;
                }
                else if (settings == 0x01) {
                    // screen jump
                    let from = currentScreen;
                    let to = yposition;
                    let toV = (fileData[snes2pc(pointer + 1)]) & 0b1111;
                    currentScreen = to;
                    currentVScreen = toV;
                }
                else {
                    if (settings === 0x02) {
                        // extended exit object
                        const scrNumber = (fileData[snes2pc(pointer + 0)]) & 0b11111;
                        const waterFlag = ((fileData[snes2pc(pointer + 4)] >>> 3) & 0b1);
                        const secondaryExitID = (((fileData[snes2pc(pointer + 4)] >>> 4) << 9) |
                            (((fileData[snes2pc(pointer + 4)] & 0b1) << 8) | fileData[snes2pc(pointer + 3)]));
                        const lmFlag = 1;
                        const isSecond = 1;
                        const exit = new Exit();
                        exit.scrNumber = scrNumber;
                        exit.isWaterMid = waterFlag;
                        exit.destLevel = secondaryExitID;
                        exit.LMflag = lmFlag;
                        exit.isSecond = isSecond;
                        exits.push(exit);
                        pointer += 5;
                        continue loop;
                    }
                    else if (settings === 0x03) {
                        // extended jump object
                        const scrNumber = (fileData[snes2pc(pointer + 1)]) & 0b1111;
                        currentScreen = scrNumber;
                        const toV = (fileData[snes2pc(pointer + 0)]) & 0b11111;
                        currentVScreen = toV;
                        pointer += 3;
                        continue loop;
                    }
                    else {
                        log("Undefined extended object: " + settings.toString(16));
                        alert("Undefined extended object: " + settings.toString(16));
                        unload();
                    }
                }
            }
            else {
                switch (objNum) {
                    case 0x26:
                        {
                            // Object for music bypass
                            const newscreen = (fileData[snes2pc(pointer + 0)] & 0xFF) >>> 7;
                            if (newscreen) {
                                currentScreen++;
                            }
                            const songID = fileData[snes2pc(pointer + 2)] - 1;
                            bypassedMusic = songID;
                            log("Music is bypassed: " + songID.toString(16));
                        }
                        break;
                    case 0x28:
                        {
                            // Object for time bypass;
                            const newscreen = (fileData[snes2pc(pointer + 0)] & 0xFF) >>> 7;
                            if (newscreen) {
                                currentScreen++;
                            }
                            const one = (fileData[snes2pc(pointer + 1)] & 0b1111);
                            const ten = (fileData[snes2pc(pointer + 0)] & 0b1111);
                            const hundred = (fileData[snes2pc(pointer + 2)] & 0b1111);
                            const reset = fileData[snes2pc(pointer + 2)] >>> 7;
                            isTimeBypassed = true;
                            ones = one;
                            tens = ten;
                            hundreds = hundred;
                            resetTheTime = !!reset;
                            log("Timer is bypassed: " + hundred.toString(16) + ten.toString(16) + one.toString(16));
                        }
                        break;
                    case 0x22:
                    case 0x23:
                        {
                            // Object for map16 direct tiles
                            const newscreen = (fileData[snes2pc(pointer + 0)] & 0xFF) >>> 7;
                            if (newscreen) {
                                currentScreen++;
                            }
                            const xposition = (fileData[snes2pc(pointer + 1)] & 0b1111);
                            const yposition = (fileData[snes2pc(pointer + 0)] & 0b11111);
                            const height = ((fileData[snes2pc(pointer + 2)] >>> 4) & 0b1111) + 1;
                            const width = ((fileData[snes2pc(pointer + 2)] >>> 0) & 0b1111) + 1;
                            const number = ((((fileData[snes2pc(pointer + 1)] >>> 4) & 0b1) << 8) | (fileData[snes2pc(pointer + 3)]));
                            const newObj = new Obj(objNum, xposition, yposition, settings);
                            newObj.screen = currentScreen;
                            newObj.tileNum = number;
                            newObj.tileWidth = width;
                            newObj.tileHeight = height;
                            objList.push(newObj);
                            log("Direct Map16 tile (A): 0x" + number.toString(16));
                            pointer += 4;
                            continue loop;
                        }
                        break;
                    case 0x2D:
                        {
                            // User-defined object
                            const newscreen = (fileData[snes2pc(pointer + 0)] & 0xFF) >>> 7;
                            if (newscreen) {
                                currentScreen++;
                            }
                            const x = (fileData[snes2pc(pointer + 1)] & 0b1111);
                            const y = (fileData[snes2pc(pointer + 0)] & 0b11111);
                            const extA = fileData[snes2pc(pointer + 3)];
                            const extB = fileData[snes2pc(pointer + 4)];
                            const settings = fileData[snes2pc(pointer + 2)];
                            const newObj = new Obj(objNum, x, y, settings);
                            newObj.screen = currentScreen;
                            newObj.extA = extA;
                            newObj.extB = extB;
                            objList.push(newObj);
                            log("User Defined Object: " + extA.toString(16) + " " + extB.toString(16));
                            pointer += 5;
                            continue loop;
                        }
                        break;
                    case 0x24:
                    case 0x25:
                        {
                            // old gfx bypass
                            const newscreen = (fileData[snes2pc(pointer + 0)] & 0xFF) >>> 7;
                            if (newscreen) {
                                currentScreen++;
                            }
                            const sprGFXi = (((fileData[snes2pc(pointer + 0)] & 0B1111) << 4) | (fileData[snes2pc(pointer + 1)] & 0b1111)) - 1;
                            const fgbgGFXi = fileData[snes2pc(pointer + 2)] - 1;
                            if (objNum === 0x24) {
                                fgbgGFXindex = fgbgGFXi;
                                sprGFXindex = sprGFXi;
                                if (!superGFXBypass) {
                                    loadOldGfxBypass(fgbgGFXindex, sprGFXindex);
                                }
                                log("Old GFX Bypass : " + fgbgGFXi.toString(16) + " " + sprGFXi.toString(16));
                            }
                            else {
                                const ani2 = fgbgGFXi;
                                const unknown = sprGFXi;
                                if (!superGFXBypass) {
                                    loadOldAni(ani2);
                                }
                                log("Old GFX Bypass #2 : " + fgbgGFXi.toString(16) + " " + sprGFXi.toString(16));
                            }
                            pointer += 3;
                            continue loop;
                        }
                        break;
                    case 0x27:
                    case 0x29:
                        {
                            // map16 direct tile object.
                            let lengthOfHeader = 5;
                            const mode = fileData[snes2pc(pointer + 3)] >>> 6;
                            const submode = fileData[snes2pc(pointer + 2)] >>> 7;
                            const rangeBits = fileData[snes2pc(pointer + 1)] >>> 4;
                            const newscr = fileData[snes2pc(pointer + 0)] >>> 7;
                            if (newscr) {
                                currentScreen++;
                            }
                            const x = (fileData[snes2pc(pointer + 1)] & 0b1111);
                            const y = (fileData[snes2pc(pointer + 0)] & 0b11111);
                            let m16Num = (((fileData[snes2pc(pointer + 3)] & 0b111111) << 8) | fileData[snes2pc(pointer + 4)]);
                            if (rangeBits === 0b0111) {
                                m16Num = m16Num;
                            }
                            else if (rangeBits === 0b1001) {
                                m16Num = 0x4000 + m16Num;
                            }
                            else {
                                alert("Undefined");
                                unload();
                            }
                            let width, height;
                            width = (fileData[snes2pc(pointer + 2)] & 0b1111) + 1;
                            height = (fileData[snes2pc(pointer + 2)] >>> 4) + 1;
                            let height16 = 0, width16 = 0;
                            let conditionalDirectMap16FlagToUse = 0, conditionalDirectMap16UseAddition = 0;
                            if (mode === 0) {
                                lengthOfHeader = 5;
                                //console.log("Single-screen, single tile");
                            }
                            else if (mode === 1) {
                                lengthOfHeader = 5;
                                console.log("Multiple tiles unstretched");
                            }
                            else if (mode === 2) {
                                height16 = read1(pointer + 5) >>> 4;
                                width16 = read1(pointer + 5) & 0b1111;
                                lengthOfHeader = 6;
                                console.log("Single-screen, multiple tiles");
                            }
                            else if (mode === 3) {
                                width = (fileData[snes2pc(pointer + 2)] & 127);
                                height = fileData[snes2pc(pointer + 6)];
                                if (submode == 0) {
                                    console.log("Multi-screen");
                                    height16 = read1(pointer + 5) >>> 4;
                                    width16 = read1(pointer + 5) & 0b1111;
                                    height = fileData[snes2pc(pointer + 6)];
                                    width = fileData[snes2pc(pointer + 2)] & 0b1111111;
                                    lengthOfHeader = 7;
                                }
                                else if (submode == 1) {
                                    console.log("Conditional direct map16");
                                    height16 = read1(pointer + 5) >>> 4;
                                    width16 = read1(pointer + 5) & 0b1111;
                                    height = fileData[snes2pc(pointer + 6)];
                                    width = fileData[snes2pc(pointer + 2)] & 0b1111111;
                                    conditionalDirectMap16FlagToUse = fileData[snes2pc(pointer + 7)] & 0b1111111;
                                    conditionalDirectMap16UseAddition = (fileData[snes2pc(pointer + 7)] >>> 7) & 0b1;
                                    lengthOfHeader = 8;
                                }
                                else {
                                    throw new Error("undefined");
                                }
                            }
                            const newObj = new Obj(objNum, x, y, settings);
                            newObj.screen = currentScreen;
                            newObj.tileNum = m16Num;
                            newObj.tileWidth = width;
                            newObj.tileHeight = height;
                            newObj.height16 = height16;
                            newObj.width16 = width16;
                            newObj.conditionalDirectMap16FlagToUse = conditionalDirectMap16FlagToUse;
                            newObj.conditionalDirectMap16UseAddition = conditionalDirectMap16UseAddition;
                            newObj.mode = mode;
                            newObj.submode = submode;
                            objList.push(newObj);
                            //log("Direct Map16 tile (B): 0x" + m16Num.toString(16));
                            pointer += lengthOfHeader;
                            continue loop;
                        }
                        break;
                    default:
                        throw new Error("Undefined object: " + objNum.toString(16));
                        break;
                }
            }
        }
        pointer += 3;
    }
    if ((!isLMModified) && exits.length && exits[exits.length - 1].isSecond) {
        for (let i = 0; i < exits.length; i++) {
            exits[i].isSecond = 1;
        }
    }
    return [objList, exits];
}
function loadSprites() {
    const spriteHeader = fileData[snes2pc(spriteDataPointer)];
    buoyancy = spriteHeader >>> 7;
    buoyancy2 = (spriteHeader >>> 6) & 1;
    sprMemory = (spriteHeader >>> 0) & 0b11111;
    useNewSpriteSystem = (spriteHeader >>> 5) & 0b1;
    let pointer = (spriteDataPointer + 1);
    let yJump = 0;
    sprites = [];
    loop: while (true) {
        let extHeaderSize;
        if ((!useNewSpriteSystem) && read1(pointer) === 0xFF) {
            break;
        }
        else if (useNewSpriteSystem && read1(pointer) === 0xFF && read1(pointer + 1) === 0xFE) {
            break;
        }
        if (useNewSpriteSystem && read1(pointer) === 0xFF) {
            const tag = read1(pointer + 1);
            switch (tag) {
                case 0xFE:
                    break loop;
                case 0xFF:
                    pointer++;
                    continue loop;
                default:
                    if (0x00 <= tag && tag <= 0x7F) {
                        yJump = tag;
                        pointer += 2;
                        continue loop;
                    }
                    else {
                        throw new Error('undefined command ' + tag.toString(16));
                    }
                    break;
            }
        }
        let xPosition, yPosition;
        let spriteID;
        let extra;
        let screenNum;
        yPosition = ((yJump << 5) | ((((fileData[snes2pc(pointer + 0)]) & 1) << 4) | ((fileData[snes2pc(pointer + 0)]) >> 4)));
        xPosition = (fileData[snes2pc(pointer + 1)]) >>> 4;
        spriteID = (fileData[snes2pc(pointer + 2)]);
        extra = (((fileData[snes2pc(pointer + 0)]) >>> 2) & 0b11);
        screenNum = ((fileData[snes2pc(pointer + 0)] >>> 1) & 1) << 4 | (fileData[snes2pc(pointer + 1)] & 0b1111);
        sprites.push({
            xPosition: xPosition,
            yPosition: yPosition,
            spriteID: spriteID,
            extra: extra,
            screenNum: screenNum,
        });
        if (isLMModified && read1(0x0EF30F) === 0x42) {
            const pointer = read3(0x0EF30C);
            extHeaderSize = read1(pointer + (extra * 0x100) + spriteID);
        }
        else {
            extHeaderSize = 0;
        }
        pointer += 3 + extHeaderSize;
    }
}
function getCustomBackAreaColor(customPaletteAddr) {
    let temp;
    let r, g, b;
    let bgColor;
    temp = fileData[snes2pc(customPaletteAddr + 1)] << 8 | fileData[snes2pc(customPaletteAddr)];
    // convert bgColor
    r = (temp & 0b11111) * 8;
    g = ((temp >> 5) & 0b11111) * 8;
    b = ((temp >> 10) & 0b11111) * 8;
    bgColor = new RGB();
    bgColor.r = r;
    bgColor.g = g;
    bgColor.b = b;
    return bgColor;
}
function getCustomPalette(customPaletteAddr, disableOrgLevelPalAni = false) {
    let palette;
    let data;
    // reset palette array
    palette = new Array(16);
    for (let i = 0; i < palette.length; i++) {
        palette[i] = new Array(16);
        for (let j = 0; j < palette[i].length; j++) {
            palette[i][j] = 0;
        }
        palette[i][0] = 0;
        palette[i][1] = 32767;
    }
    let addr = customPaletteAddr + 2;
    for (let i = 0; i < palette.length; i++) {
        for (let j = 0; j < palette[i].length; j++) {
            const data = readPal(addr, (i * 16) + j);
            palette[i][j] = data;
        }
    }
    // animated color palette
    if (!disableOrgLevelPalAni) {
        addr = (0x00b60c + (0x2 * 0));
        data = readPal(addr);
        palette[6][4] = data;
    }
    /* Convert palettes */
    let pal = new Array(16);
    for (let i = 0; i < 16; i++) {
        pal[i] = new Array(16);
        for (let j = 0; j < 16; j++) {
            let r, g, b;
            r = ((palette[i][j]) & 0b11111) * 8;
            g = ((palette[i][j] >>> 5) & 0b11111) * 8;
            b = ((palette[i][j] >>> 10) & 0b11111) * 8;
            pal[i][j] = {
                r: r,
                g: g,
                b: b,
            };
        }
    }
    return pal;
}
function readPal(addr, index = 0) {
    return fileData[snes2pc((addr + ((index * 2)) + 1))] << 8 | fileData[snes2pc(addr + (index * 2))];
}
function getPalette(bgPalNum, fgPalNum, spPalNum, disableOrgLevelPalAni = false) {
    let palette;
    let addr;
    let data;
    // reset palette array
    palette = new Array(16);
    for (let i = 0; i < palette.length; i++) {
        palette[i] = new Array(16);
        for (let j = 0; j < palette[i].length; j++) {
            palette[i][j] = 0;
        }
        palette[i][0] = 0;
        palette[i][1] = 32767;
    }
    // get background palette
    addr = (0x00b0b0 + (0x18 * bgPalNum));
    for (let i = 0; i < 0xC; i++) {
        const data = readPal(addr, i);
        if (i < 6) {
            palette[0][2 + i] = data;
        }
        else {
            palette[1][(i - 6) + 2] = data;
        }
    }
    // fg palette
    addr = (0x00b190 + (0x18 * fgPalNum));
    for (let i = 0; i < 0xC; i++) {
        const data = readPal(addr, i);
        if (i < 6) {
            palette[2][2 + i] = data;
        }
        else {
            palette[3][(i - 6) + 2] = data;
        }
    }
    // sprite palette
    addr = (0x00b318 + (0x18 * spPalNum));
    for (let i = 0; i < 0xC; i++) {
        const data = readPal(addr, i);
        if (i < 6) {
            palette[0xe][2 + i] = data;
        }
        else {
            palette[0xf][(i - 6) + 2] = data;
        }
    }
    // basic palette
    for (let i = 4; i <= 0xD; i++) {
        const addr = (0x00b250 + (0x0c * (i - 5)));
        for (let j = 0; j < 0xC; j++) {
            const data = readPal(addr, j);
            if (j < 6) {
                palette[i][2 + j] = data;
            }
            else {
                palette[i][(j - 6) + 2] = data;
            }
        }
    }
    // animated color palette
    if (!disableOrgLevelPalAni) {
        addr = (0x00b60c + (0x2 * 0));
        data = readPal(addr);
        palette[6][4] = data;
    }
    // mario palette
    addr = (0x00b2c8 + (0x14 * 0));
    for (let i = 0; i < 0xA; i++) {
        const data = readPal(addr, i);
        palette[8][6 + i] = data;
    }
    // layer 3 palette
    for (let k = 0; k < 2; k++) {
        const addr = (0x00B170 + (0x10 * k));
        for (let i = 0; i < 0x8; i++) {
            const data = readPal(addr, i);
            palette[k][8 + i] = data;
        }
    }
    // berries palette
    for (let k = 0; k < 3; k++) {
        const addr = (0x00B674 + (0xE * ((k + 2) - 2)));
        for (let i = 0; i < 0x7; i++) {
            const data = readPal(addr, i);
            palette[2 + k][9 + i] = data;
            palette[9 + k][9 + i] = data;
        }
    }
    /* Convert palettes */
    let pal = new Array(16);
    for (let i = 0; i < 16; i++) {
        pal[i] = new Array(16);
        for (let j = 0; j < 16; j++) {
            let r, g, b;
            r = ((palette[i][j]) & 0b11111) * 8;
            g = ((palette[i][j] >>> 5) & 0b11111) * 8;
            b = ((palette[i][j] >>> 10) & 0b11111) * 8;
            pal[i][j] = {
                r: r,
                g: g,
                b: b,
            };
        }
    }
    return pal;
}
function getCompressedGraphicsAddr(index) {
    let addr = 0;
    if (index <= 0x31) {
        addr = snes2pc(((fileData[snes2pc(0x00b9f6 + index)]) << 16) |
            ((fileData[snes2pc(0x00b9c4 + index)]) << 8) | fileData[snes2pc(0x00b992 + index)]);
    }
    else if (0x60 <= index && index <= 0x63) {
        addr = snes2pc(read3(0x03BCC0 + ((index - 0x60) * 3)));
    }
    else if (0x80 <= index && index <= 0xFF) {
        addr = snes2pc(read3(0x0FF600 + ((index - 0x80) * 3)));
    }
    else if (0x100 <= index && index <= 0xFFF) {
        addr = snes2pc(read3(read3(0x0FF937) + ((index - 0x100) * 3)));
    }
    else {
        debugger;
        throw new Error();
    }
    return addr;
}
function getUncompressedGFX(num, direct = false) {
    let offset;
    if (direct) {
        offset = snes2pc(num);
    }
    else if (num === 0x7F) {
        return [];
    }
    else {
        offset = getCompressedGraphicsAddr(num);
    }
    return decompress_lz2(fileData.slice(offset));
}
function loadOldAni(index) {
    ani2 = index;
    const ani2gfx = getUncompressedGFX(ani2);
    ani2bmp = convertGraphics(ani2gfx, is4bpp);
    loadOldGfxBypassAni();
}
function loadOldGfxBypass(fgbgGFXIndex, sprGFXIndex) {
    const fgbgGFXList = getOldGFXBypassList(fgbgGFXIndex);
    const sprGFXList = getOldGFXBypassList(sprGFXIndex);
    if (fgbgGFXIndex !== -1) {
        fg3 = fgbgGFXList[0];
        bg = fgbgGFXList[1];
        fg2 = fgbgGFXList[2];
        fg1 = fgbgGFXList[3];
    }
    if (sprGFXIndex !== -1) {
        sp4 = sprGFXList[0];
        sp3 = sprGFXList[1];
        sp2 = sprGFXList[2];
        sp1 = sprGFXList[3];
    }
    const fg1gfx = getUncompressedGFX(fg1);
    const fg2gfx = getUncompressedGFX(fg2);
    const bggfx = getUncompressedGFX(bg);
    const fg3gfx = getUncompressedGFX(fg3);
    const sp1gfx = getUncompressedGFX(sp1);
    const sp2gfx = getUncompressedGFX(sp2);
    const sp3gfx = getUncompressedGFX(sp3);
    const sp4gfx = getUncompressedGFX(sp4);
    fg1bmp = convertGraphics(fg1gfx, is4bpp);
    fg2bmp = convertGraphics(fg2gfx, is4bpp);
    fg3bmp = convertGraphics(fg3gfx, is4bpp);
    bgbmp = convertGraphics(bggfx, is4bpp);
    orgFg1bmp = structuredClone(fg1bmp);
    orgFg2bmp = structuredClone(fg2bmp);
    orgBgbmp = structuredClone(bgbmp);
    orgFg3bmp = structuredClone(fg3bmp);
    sp1bmp = convertGraphics(sp1gfx, is4bpp);
    sp2bmp = convertGraphics(sp2gfx, is4bpp);
    sp3bmp = convertGraphics(sp3gfx, is4bpp);
    sp4bmp = convertGraphics(sp4gfx, is4bpp);
    orgSp1bmp = structuredClone(sp1bmp);
    orgSp2bmp = structuredClone(sp2bmp);
    orgSp3bmp = structuredClone(sp3bmp);
    orgSp4bmp = structuredClone(sp4bmp);
    loadOldGfxBypassAni();
}
function loadOldGfxBypassAni() {
    if (!disableOrgLevelAni) {
        original_animation();
    }
    loadExAnimations();
    renderExAnimation();
}
function loadGraphics() {
    let fg1gfx, fg2gfx, bggfx, fg3gfx;
    let sp1gfx, sp2gfx, sp3gfx, sp4gfx;
    let bg2gfx, bg3gfx;
    let anigfx, ani2gfx;
    let mariogfx;
    // get tileset
    if ((fgbgGFX >= tilesetList.length)) {
        throw new Error();
    }
    tileset = tilesetList[fgbgGFX];
    /* Get Level's graphics number */
    fg1 = read1((0xA92B) + (4 * fgbgGFX) + 0);
    fg2 = read1((0xA92B) + (4 * fgbgGFX) + 1);
    bg = read1((0xA92B) + (4 * fgbgGFX) + 2);
    fg3 = read1((0xA92B) + (4 * fgbgGFX) + 3);
    bg2 = 0x7f;
    bg3 = 0x7f;
    ani2 = 0x7f;
    sp1 = read1((spriteGfxTable) + (4 * sprGFX + 0));
    sp2 = read1((spriteGfxTable) + (4 * sprGFX + 1));
    sp3 = read1((spriteGfxTable) + (4 * sprGFX + 2));
    sp4 = read1((spriteGfxTable) + (4 * sprGFX + 3));
    /* Load GFX */
    fg1gfx = getUncompressedGFX(fg1);
    fg2gfx = getUncompressedGFX(fg2);
    bggfx = getUncompressedGFX(bg);
    fg3gfx = getUncompressedGFX(fg3);
    // Sprite Graphics
    sp1gfx = getUncompressedGFX(sp1);
    sp2gfx = getUncompressedGFX(sp2);
    sp3gfx = getUncompressedGFX(sp3);
    sp4gfx = getUncompressedGFX(sp4);
    bg2gfx = getUncompressedGFX(bg2);
    bg3gfx = getUncompressedGFX(bg3);
    ani2gfx = getUncompressedGFX(ani2);
    if (isLMModified && lmVer >= 1.62) {
        const pointer = read3(0x0FF7FF) + (32 * (levelNum));
        superGFXBypass = !!(read2(pointer) >>> 15);
        console.log("superGFXBypass: " + superGFXBypass);
        if (superGFXBypass) {
            fg1 = read2(pointer + (2 * 7)) & 4095;
            fg2 = read2(pointer + (2 * 6)) & 4095;
            bg = read2(pointer + (2 * 5)) & 4095;
            fg3 = read2(pointer + (2 * 4)) & 4095;
            bg2 = read2(pointer + (2 * 3)) & 4095;
            bg3 = read2(pointer + (2 * 2)) & 4095;
            ani2 = read2(pointer + (2 * 0)) & 4095;
            sp1 = read2(pointer + (2 * 11)) & 4095;
            sp2 = read2(pointer + (2 * 10)) & 4095;
            sp3 = read2(pointer + (2 * 9)) & 4095;
            sp4 = read2(pointer + (2 * 8)) & 4095;
        }
    }
    else {
        superGFXBypass = false;
    }
    if (superGFXBypass) {
        try {
            // FG/BG GFX
            fg1gfx = getUncompressedGFX(fg1);
            fg2gfx = getUncompressedGFX(fg2);
            bggfx = getUncompressedGFX(bg);
            fg3gfx = getUncompressedGFX(fg3);
            // Sprite Graphics
            sp1gfx = getUncompressedGFX(sp1);
            sp2gfx = getUncompressedGFX(sp2);
            sp3gfx = getUncompressedGFX(sp3);
            sp4gfx = getUncompressedGFX(sp4);
            bg2gfx = getUncompressedGFX(bg2);
            bg3gfx = getUncompressedGFX(bg3);
            ani2gfx = getUncompressedGFX(ani2);
        }
        catch (e) {
            superGFXBypass = false;
        }
    }
    // Animation graphics
    let gfx33Pointer = 0x8bfc0;
    if (isLMModified) {
        gfx33Pointer = (((read1(0x00B890) << 16) | read2(0x00B88B)));
    }
    anigfx = getUncompressedGFX(gfx33Pointer, true);
    let gfx32Pointer = 0x88000;
    if (isLMModified) {
        gfx32Pointer = (((read1(0x00B890) << 16) | read2(0x00B8D8)));
    }
    mariogfx = getUncompressedGFX(gfx32Pointer, true);
    // check bpp
    is4bpp = false;
    if (read1(0x0480D0) === 96) {
        console.log("4bpp");
        is4bpp = true;
    }
    if (read1(0x0095E9) === 92) {
        console.log("4bpp");
        is4bpp = true;
    }
    /* Convert Graphics */
    fg1bmp = convertGraphics(fg1gfx, is4bpp);
    fg2bmp = convertGraphics(fg2gfx, is4bpp);
    fg3bmp = convertGraphics(fg3gfx, is4bpp);
    bgbmp = convertGraphics(bggfx, is4bpp);
    orgFg1bmp = structuredClone(fg1bmp);
    orgFg2bmp = structuredClone(fg2bmp);
    orgBgbmp = structuredClone(bgbmp);
    orgFg3bmp = structuredClone(fg3bmp);
    bg2bmp = convertGraphics(bg2gfx, is4bpp);
    orgBg2bmp = structuredClone(bg2bmp);
    bg3bmp = convertGraphics(bg3gfx, is4bpp);
    orgBg3bmp = structuredClone(bg3bmp);
    ani2bmp = convertGraphics(ani2gfx, is4bpp);
    anibmp = convertGraphics(anigfx, is4bpp);
    mariobmp = convertGraphics(mariogfx, is4bpp);
    sp1bmp = convertGraphics(sp1gfx, is4bpp);
    sp2bmp = convertGraphics(sp2gfx, is4bpp);
    sp3bmp = convertGraphics(sp3gfx, is4bpp);
    sp4bmp = convertGraphics(sp4gfx, is4bpp);
    orgSp1bmp = structuredClone(sp1bmp);
    orgSp2bmp = structuredClone(sp2bmp);
    orgSp3bmp = structuredClone(sp3bmp);
    orgSp4bmp = structuredClone(sp4bmp);
    if (!disableOrgLevelAni) {
        original_animation();
    }
}
function original_animation() {
    animate_4_8x8s_line(fg1bmp, anibmp, 0x68, 0xC8);
    animate_4_8x8s_line(fg1bmp, anibmp, 0x60, 0xD0);
    animate_4_8x8s_line(fg1bmp, anibmp, 0x78, 0xD0);
    animate_4_8x8s_line(fg1bmp, anibmp, 0x6C, 0xDC);
    animate_4_8x8s_line(fg1bmp, anibmp, 0x64, 0xD4);
    animate_4_8x8s_line(fg1bmp, anibmp, 0x74, 0x114);
    animate_4_8x8s_line(fg1bmp, anibmp, 0x5C, 0x138);
    animate_4_8x8s_line(fg1bmp, anibmp, 0x50, 0xA4);
    animate_4_8x8s_line(fg1bmp, anibmp, 0x54, 0xDC);
    animate_4_8x8s_line(fg1bmp, anibmp, 0x58, 0xB4);
    animate_4_8x8s_line(fg2bmp, anibmp, 0x5A, 0xA0);
    animate_4_8x8s_line(fg2bmp, anibmp, 0x6A, 0xD8);
    animate_4_8x8s_line(fg1bmp, anibmp, 0x70, 0x110);
    animate_4_8x8s_line(fg1bmp, anibmp, 0x7C, 0x178);
    if (isLMModified) {
        fg2bmp[0x00 + 0] = mariobmp[0x2E0 + 0];
        fg2bmp[0x00 + 1] = mariobmp[0x2E0 + 1];
        fg2bmp[0x10 + 0] = mariobmp[0x2E0 + 2];
        fg2bmp[0x10 + 1] = mariobmp[0x2E0 + 3];
    }
    if (tileset === 0) {
        animate_4_8x8s_line(fg1bmp, anibmp, 0x40, 0xC0);
        animate_4_8x8s_line(fg1bmp, anibmp, 0x44, 0x98);
        animate_4_8x8s_line(fg1bmp, anibmp, 0x48, 0xC0);
        animate_4_8x8s_line(fg1bmp, anibmp, 0x4C, 0x14C);
    }
    else if (tileset === 1) {
        animate_4_8x8s_line(fg1bmp, anibmp, 0x40, 0x118);
        animate_4_8x8s_line(fg1bmp, anibmp, 0x44, 0x10);
        animate_4_8x8s_line(fg1bmp, anibmp, 0x48, 0x30);
        animate_4_8x8s_line(fg1bmp, anibmp, 0x4C, 0x9C);
    }
    else if (tileset === 2) {
        // rope
        animate_4_8x8s_line(fg1bmp, anibmp, 0x40, 0xC0);
        animate_4_8x8s_line(fg1bmp, anibmp, 0x44, 0x144);
        animate_4_8x8s_line(fg1bmp, anibmp, 0x48, 0x164);
        animate_4_8x8s_line(fg1bmp, anibmp, 0x4C, 0x150);
    }
    else if (tileset === 3) {
        animate_4_8x8s_line(fg1bmp, anibmp, 0x40, 0x14);
        animate_4_8x8s_line(fg1bmp, anibmp, 0x44, 0x18);
        animate_4_8x8s_line(fg1bmp, anibmp, 0x48, 0x1C);
        animate_4_8x8s_line(fg1bmp, anibmp, 0x4C, 0x34);
        animate_4_8x8s_line(fg1bmp, anibmp, 0x70, 0x11C);
    }
    else if (tileset === 4) {
        animate_4_8x8s_line(fg1bmp, anibmp, 0x40, 0xC0);
        animate_4_8x8s_line(fg1bmp, anibmp, 0x44, 0x98);
        animate_4_8x8s_line(fg1bmp, anibmp, 0x48, 0xC0);
        animate_4_8x8s_line(fg1bmp, anibmp, 0x4C, 0x14C);
    }
    if (fgbgGFX === 0x06) {
        animate_4_8x8s_line(fg1bmp, anibmp, 0x40, 0xC0);
        animate_4_8x8s_line(fg1bmp, anibmp, 0x44, 0xC0);
        animate_4_8x8s_line(fg1bmp, anibmp, 0x48, 0xC0);
        animate_4_8x8s_line(fg1bmp, anibmp, 0x4C, 0x158);
        animate_4_8x8s_line(fg1bmp, anibmp, 0x70, 0x10C);
    }
    else if (fgbgGFX === 0x09) {
        animate_4_8x8s_line(fg1bmp, anibmp, 0x40, 0xC0);
        animate_4_8x8s_line(fg1bmp, anibmp, 0x44, 0x98);
        animate_4_8x8s_line(fg1bmp, anibmp, 0x48, 0xC0);
        animate_4_8x8s_line(fg1bmp, anibmp, 0x4C, 0x14C);
    }
    else if (fgbgGFX === 0x00) {
        animate_4_8x8s_line(fg1bmp, anibmp, 0x4C, 0x9C);
    }
    else if (fgbgGFX === 0xC || fgbgGFX === 0xD) {
        animate_4_8x8s_line(fg1bmp, anibmp, 0x4C, 0x9C);
    }
}
function animate_4_8x8s_line(dest, src, destStart, srcStart) {
    for (let i = 0; i < 4; i++) {
        dest[destStart + i] = src[srcStart + i];
    }
}
function getSecondaryExits() {
    const secondaryExits = new Array();
    let table1 = 0x05F800, table2 = 0x05FA00, table3 = 0x05FC00, table4 = 0x05FE00;
    if (lmVer >= 2.5) {
        table1 = read3(0x0DE191);
        table2 = read3(0x0DE198);
        table3 = read3(0x0DE19F);
        table4 = read3(0x05DC81);
    }
    for (let i = 0; i < 512; i++) {
        let header1, header2, header3, header4;
        let header5 = 0, header6 = 0;
        const exit = new SecondExit();
        header1 = read1(table1 + i);
        header2 = read1(table2 + i);
        header3 = read1(table3 + i);
        header4 = read1(table4 + i);
        if (isLMModified && lmVer >= 3.0) {
            header5 = read1(read3(0x05DC86) + i);
            header6 = read1(read3(0x05DC8B) + i);
        }
        else {
            header5 = 0;
            header6 = 0;
        }
        let dest = (((header4 >>> 3) & 0b1) << 8) | header1;
        const bg = header2 >>> 6;
        const fg = (header2 >>> 4) & 0b11;
        let y;
        let x;
        if (!isLMModified) {
            y = (header2 & 0b1111);
            x = header3 >>> 5;
        }
        else if (lmVer < 3.0) {
            y = ((((header4 >>> 5) & 0b1) << 4) | (header2 & 0b1111));
            x = ((((header4 >>> 4) & 0b1) << 3) | ((header3 >>> 5) & 0b111));
        }
        else {
            y = (((header5 & 0b111111) << 4) | (header2 & 0b1111));
            x = ((((header4 >>> 4) & 0b11) << 3) | ((header3 >>> 5) & 0b111));
        }
        const scrNum = header3 & 0b11111;
        const action = header4 & 0b111;
        if (!isLMModified) {
            dest = (((levelNum >>> 8) & 1) << 8) | header1;
        }
        let offset;
        if (isLMModified) {
            offset = ((header2 >>> 4) & 0b1111);
            if (lmVer >= 3.0) {
                offset |= ((header5 >>> 6) & 0b1) << 4;
            }
        }
        else {
            offset = ((header2 >>> 4) & 0b1111);
        }
        let water;
        if (lmVer >= 3.0) {
            water = (header6 >>> 5) & 1;
        }
        else {
            water = 0;
        }
        let slippery = 0;
        if (isLMModified) {
            slippery = header4 >>> 7;
        }
        let method2 = 0;
        if (isLMModified) {
            method2 = (header4 >>> 6) & 0b1;
        }
        let exitToOW = 0;
        if (isLMModified) {
            exitToOW = header5 >>> 7;
        }
        let relative = 0;
        if (isLMModified) {
            relative = header6 >>> 7;
        }
        let enterLeft = 0;
        if (enterLeft) {
            enterLeft = (header6 >>> 6) & 0b1;
        }
        exit.dest = dest;
        exit.bg = bg;
        exit.fg = fg;
        exit.offset = offset;
        exit.x = x;
        exit.y = y;
        exit.scrNum = scrNum;
        exit.slippery = slippery;
        exit.method2 = method2;
        exit.action = action;
        exit.exitToOW = exitToOW;
        exit.relative = relative;
        exit.enterLeft = enterLeft;
        exit.water = water;
        if (exitToOW) {
            exit.location = header2;
            exit.event = header3;
            const action = header4 & 0b111;
            exit.action = action;
            const e = (header4 >>> 5) & 1;
            exit.useDiffEvent = e;
            const t = (header4 >>> 4) & 1;
            exit.useTeleport = t;
        }
        secondaryExits.push(exit);
    }
    return secondaryExits;
}
function load16x16() {
    let blocks = new Array(512);
    let bgBlocks = new Array(512);
    getMap16(0x000, 0x1ff, 0x0D9100, bgBlocks);
    getMap16(0x000, 0x072, 0x0D8000, blocks);
    getMap16(0x100, 0x106, 0x0D8398, blocks);
    getMap16(0x111, 0x152, 0x0D83D0, blocks);
    getMap16(0x16E, 0x1C3, 0x0D85E0, blocks);
    getMap16(0x1C4, 0x1C7, 0x0D8890, blocks);
    getMap16(0x1C8, 0x1EB, 0x0D88B0, blocks);
    getMap16(0x1EC, 0x1EF, 0x0D89D0, blocks);
    getMap16(0x1F0, 0x1FF, 0x0D89F0, blocks);
    if (fgbgGFX == 0 || fgbgGFX == 7) {
        getMap16(0x1C4, 0x1C7, 0x0D8A70, blocks);
        getMap16(0x1EC, 0x1EF, 0x0D8A90, blocks);
    }
    if (tileset == 0) {
        getMap16(0x073, 0x0FF, 0x0D8B70, blocks);
        getMap16(0x107, 0x110, 0x0D8FD8, blocks);
        getMap16(0x153, 0x16D, 0x0D9028, blocks);
    }
    else if (tileset == 1) {
        getMap16(0x073, 0x0FF, 0x0DBC00, blocks);
        getMap16(0x107, 0x110, 0x0DC068, blocks);
        getMap16(0x153, 0x16D, 0x0DC0B8, blocks);
    }
    else if (tileset == 2) {
        getMap16(0x073, 0x0FF, 0x0DC800, blocks);
        getMap16(0x107, 0x110, 0x0DCC68, blocks);
        getMap16(0x153, 0x16D, 0x0DCCB8, blocks);
    }
    else if (tileset == 3) {
        getMap16(0x073, 0x0FF, 0x0DD400, blocks);
        getMap16(0x107, 0x110, 0x0DD868, blocks);
        getMap16(0x153, 0x16D, 0x0DD8B8, blocks);
    }
    else if (tileset == 4) {
        getMap16(0x073, 0x0FF, 0x0DE300, blocks);
        getMap16(0x107, 0x110, 0x0DE768, blocks);
        getMap16(0x153, 0x16D, 0x0DE7B8, blocks);
    }
    if (isLMModified && 1.31 <= lmVer && lmVer <= 1.65) {
        const pointer = 0x118000;
        getMap16(0x200, 0x2FF, pointer + (fgbgGFX * 0x100 * 8), blocks);
        for (let i = 0x3; i < 0x10; i++) {
            getMap16(i * 0x100, i * 0x100 + 0xFF, pointer + ((0x0F * 0x100 * 8) + ((i - 3) * 0x100 * 8)), blocks);
        }
    }
    else if (isLMModified) {
        const pointers = [
            ((read1(0x06F557) << 16) | ((read2(0x06F553) + 0x1000) & 0xFFFF)),
            ((read1(0x06F560) << 16) | ((read2(0x06F55C) + 0x8000) & 0xFFFF)),
            ((read1(0x06F56B) << 16) | (read2(0x06F567))) + 1,
            ((read1(0x06F574) << 16) | ((read2(0x06F570) + 0x8000) & 0xFFFF)) + 1,
            ((read1(0x06F598) << 16) | (read2(0x06F594))),
            ((read1(0x06F5A1) << 16) | ((read2(0x06F59D) + 0x8000) & 0xFFFF)),
            ((read1(0x06F5AC) << 16) | (read2(0x06F5A8))) + 1,
            ((read1(0x06F5B5) << 16) | ((read2(0x06F5B1) + 0x8000) & 0xFFFF)) + 1,
        ];
        const isPage2TilesetSpecific = (read1(0x06F547) !== 0 ? true : false);
        if (isPage2TilesetSpecific) {
            const pointer = ((read1(0x06F58A) << 16) | (read2(0x06F586))) + 0x1000;
            const address = pointer + (fgbgGFX << 11);
            getMap16(0x200, 0x2FF, address, blocks);
        }
        else {
            const pointer = pointers[0];
            getMap16(0x200, 0x2FF, pointer, blocks);
        }
        const pointer = pointers[0];
        for (let i = 0x3; i < 0x10; i++) {
            const start = i * 0x100;
            const end = start + (0x100 - 1);
            const address = pointer + (i - 2) * (0x100 * 8);
            getMap16(start, end, address, blocks);
        }
        for (let k = 1; k < pointers.length; k++) {
            const pointer = pointers[k];
            for (let i = 0x0; i < 0x10; i++) {
                const start = (k * 0x1000) + (i * 0x100);
                const end = start + (0x100 - 1);
                const address = pointer + (i) * (0x100 * 8);
                getMap16(start, end, address, blocks);
            }
        }
        const bgPointers = 0x0EFD50;
        for (let k = 0; k < 8; k++) {
            const bgPointer = read3(bgPointers + (3 * k));
            if (bgPointer === 0)
                break;
            for (let i = 0x0; i < 0x10; i++) {
                if (k === 0 && (i === 0 || i === 1)) {
                    continue;
                }
                const start = (k * 0x1000) + (i * 0x100);
                const end = start + (0x100 - 1);
                const address = bgPointer + i * (0x100 * 8);
                getMap16(start, end, address, bgBlocks);
            }
        }
    }
    map16 = blocks;
    bgTiles = bgBlocks;
}
function getMap16(start, end, tblAddr, blocks) {
    for (let i = 0; i <= end - start; i++) {
        // YXPCCCTT
        let tile = new Tile();
        tile.upleft = new TilePart();
        tile.upright = new TilePart();
        tile.lowleft = new TilePart();
        tile.lowright = new TilePart();
        const col = [tile.upleft, tile.lowleft, tile.upright, tile.lowright];
        let actsLike;
        if ((!isLMModified) || lmVer < 1.31) {
            actsLike = i;
        }
        else {
            const pointer1 = read3(0x06F624);
            const pointer2 = read3(0x06F63A);
            let pgGroup = intdiv(start, 0x4000);
            if (pgGroup === 0) {
                const pointer = pointer1;
                actsLike = read2(pointer + (2 * (start + i)));
            }
            else if (pgGroup === 1) {
                if (lmVer >= 2.43) {
                    const pointer = pointer2;
                    try {
                        actsLike = read2(pointer + (2 * ((start - 0x4000) + i)));
                    }
                    catch (e) {
                        actsLike = 0x130;
                    }
                }
                else {
                    actsLike = 0x130;
                }
            }
            else {
                throw new Error("Map16 tile number is bigger than 0x7FFF.");
            }
        }
        tile.actsLike = actsLike;
        for (let j = 0; j < col.length; j++) {
            const part = col[j];
            part.gfx = ((fileData[snes2pc(tblAddr + (i * 8 + (j * 2 + 1)))] & 0b11) << 8) | fileData[snes2pc(tblAddr + (i * 8 + (j * 2)))];
            part.xflip = (((fileData[snes2pc(tblAddr + (i * 8 + (j * 2 + 1)))] >> 6) & 0b1));
            part.yflip = (((fileData[snes2pc(tblAddr + (i * 8 + (j * 2 + 1)))] >> 7) & 0b1));
            part.prior = (((fileData[snes2pc(tblAddr + (i * 8 + (j * 2 + 1)))] >> 5) & 0b1));
            part.pal = (((fileData[snes2pc(tblAddr + (i * 8 + (j * 2 + 1)))] >> 2) & 0b111));
        }
        blocks[start + i] = tile;
        /*
        

        tile.upleft.gfx = ((fileData[snes2pc(tblAddr + (i*8+1))] & 0b11) << 8) | fileData[snes2pc(tblAddr + (i*8+0))];
        tile.upleft.xflip = (((fileData[snes2pc(tblAddr + (i*8+1))] >> 6) & 0b1));
        tile.upleft.yflip = (((fileData[snes2pc(tblAddr + (i*8+1))] >> 7) & 0b1));
        tile.upleft.prior = (((fileData[snes2pc(tblAddr + (i*8+1))] >> 5) & 0b1));
        tile.upleft.pal = (((fileData[snes2pc(tblAddr + (i*8+1))] >> 2) & 0b111));

        tile.lowleft.gfx = ((fileData[snes2pc(tblAddr + (i*8+3))] & 0b11) << 8) | fileData[snes2pc(tblAddr + (i*8+2))];
        tile.lowleft.xflip = (((fileData[snes2pc(tblAddr + (i*8+3))] >> 6) & 0b1));
        tile.lowleft.yflip = (((fileData[snes2pc(tblAddr + (i*8+3))] >> 7) & 0b1));
        tile.lowleft.prior = (((fileData[snes2pc(tblAddr + (i*8+3))] >> 5) & 0b1));
        tile.lowleft.pal = (((fileData[snes2pc(tblAddr + (i*8+3))] >> 2) & 0b111));

        tile.upright.gfx = ((fileData[snes2pc(tblAddr + (i*8+5))] & 0b11) << 8) | fileData[snes2pc(tblAddr + (i*8+4))];
        tile.upright.xflip = (((fileData[snes2pc(tblAddr + (i*8+5))] >> 6) & 0b1));
        tile.upright.yflip = (((fileData[snes2pc(tblAddr + (i*8+5))] >> 7) & 0b1));
        tile.upright.prior = (((fileData[snes2pc(tblAddr + (i*8+5))] >> 5) & 0b1));
        tile.upright.pal = (((fileData[snes2pc(tblAddr + (i*8+5))] >> 2) & 0b111));

        tile.lowright.gfx = ((fileData[snes2pc(tblAddr + (i*8+7))] & 0b11) << 8) | fileData[snes2pc(tblAddr + (i*8+6))];
        tile.lowright.xflip = (((fileData[snes2pc(tblAddr + (i*8+7))] >> 6) & 0b1));
        tile.lowright.yflip = (((fileData[snes2pc(tblAddr + (i*8+7))] >> 7) & 0b1));
        tile.lowright.prior = (((fileData[snes2pc(tblAddr + (i*8+7))] >> 5) & 0b1));
        tile.lowright.pal = (((fileData[snes2pc(tblAddr + (i*8+7))] >> 2) & 0b111));

        blocks[start+i] = tile;

        */
    }
}
function stone_like_image(objNum, settings, tileset = 0, topLeftBlock = 0x131, topCenterBlock = 0x131, topRightBlock = 0x131, midLeftBlock = 0x131, midCenterBlock = 0x131, midRightBlock = 0x131, btmLeftBlock = 0x131, btmCenterBlock = 0x131, btmRightBlock = 0x131) {
    const canvas = document.createElement("canvas");
    const height = getHeight(objNum, settings, tileset);
    const width = getWidth(objNum, settings, tileset);
    canvas.width = width * 16;
    canvas.height = height * 16;
    const ctx = canvas.getContext("2d");
    ctx.putImageData(stone_like_image_real(objNum, settings, tileset, topLeftBlock, topCenterBlock, topRightBlock, midLeftBlock, midCenterBlock, midRightBlock, btmLeftBlock, btmCenterBlock, btmRightBlock), 0, 0);
    return canvas.toDataURL('image/png');
}
function forest_tree_top_image(objNum, settings, tileset) {
    const canvas = document.createElement("canvas");
    const width = getWidth(objNum, settings, tileset);
    const height = getHeight(objNum, settings, tileset);
    canvas.width = width * 16;
    canvas.height = height * 16;
    const data = image_real(objNum, settings, tileset, [
        [0xB4, 0xB4, 0xB4, 0xB4, 0xB4, 0xB4, 0xB4, 0xB4, 0xB4, 0xB4, 0xB4, 0xB4, 0xB4, 0xB4, 0xB4, 0xB4],
        [0xB4, 0xB4, 0xB4, 0xB4, 0xB4, 0xB4, 0xB4, 0xB4, 0xB4, 0xB4, 0xB4, 0xB4, 0xB4, 0xB4, 0xB4, 0xB4],
        [0xB4, 0xB4, 0xB4, 0xB4, 0xB4, 0xB4, 0xB4, 0xB4, 0xB4, 0xB4, 0xB4, 0xB4, 0xB5, 0xB3, 0xB5, 0xB3],
        [0xB3, 0xB4, 0xB4, 0xB5, 0xB3, 0xB4, 0xB4, 0xB4, 0xB4, 0xB5, 0xB3, 0xB5, 0xB6, 0xB1, 0xB6, 0xB1],
        [0xB1, 0xB3, 0xB5, 0xB6, 0xB1, 0xB3, 0xB5, 0xB3, 0xB5, 0xB6, 0xB1, 0xB6, 0x25, 0x25, 0x25, 0x25],
        [0x25, 0xB1, 0xB6, 0x25, 0x25, 0xB1, 0xB6, 0xB1, 0xB6, 0x25, 0x25, 0x25, 0x25, 0x25, 0x25, 0x25],
    ]);
    const ctx = canvas.getContext("2d");
    const j = intdiv(width, 16);
    for (let i = 0; i < j; i++) {
        ctx.putImageData(data, (i * 16) * 16, 0);
    }
    return canvas.toDataURL('image/png');
}
function image_real(objNum, settings, tileset, tilesTable) {
    const canvas = document.createElement("canvas");
    const height = getHeight(objNum, settings, tileset);
    const width = getWidth(objNum, settings, tileset);
    canvas.width = width * 16;
    canvas.height = height * 16;
    const ctx = canvas.getContext("2d");
    for (let i = 0; i < tilesTable.length; i++) {
        const row = tilesTable[i];
        for (let j = 0; j < row.length; j++) {
            const tile = row[j];
            const img = getMap16TileImg(tile);
            ctx.putImageData(img, j * 16, i * 16);
        }
    }
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
}
function image(objNum, settings, tileset, tilesTable) {
    const canvas = document.createElement("canvas");
    const height = getHeight(objNum, settings, tileset);
    const width = getWidth(objNum, settings, tileset);
    canvas.width = width * 16;
    canvas.height = height * 16;
    const ctx = canvas.getContext("2d");
    const result = image_real(objNum, settings, tileset, tilesTable);
    ctx.putImageData(result, 0, 0);
    return canvas.toDataURL("image/png");
}
function stone_like_image_real(objNum, settings, tileset = 0, topLeftBlock = 0x131, topCenterBlock = 0x131, topRightBlock = 0x131, midLeftBlock = 0x131, midCenterBlock = 0x131, midRightBlock = 0x131, btmLeftBlock = 0x131, btmCenterBlock = 0x131, btmRightBlock = 0x131) {
    const topLeft = getMap16TileImg(topLeftBlock);
    const topCenter = getMap16TileImg(topCenterBlock);
    const topRight = getMap16TileImg(topRightBlock);
    const midLeft = getMap16TileImg(midLeftBlock);
    const midCenter = getMap16TileImg(midCenterBlock);
    const midRight = getMap16TileImg(midRightBlock);
    const btmLeft = getMap16TileImg(btmLeftBlock);
    const btmCenter = getMap16TileImg(btmCenterBlock);
    const btmRight = getMap16TileImg(btmRightBlock);
    const canvas = document.createElement("canvas");
    const height = getHeight(objNum, settings, tileset);
    const width = getWidth(objNum, settings, tileset);
    canvas.width = width * 16;
    canvas.height = height * 16;
    const ctx = canvas.getContext("2d");
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            ctx.putImageData(midCenter, j * 16, i * 16);
        }
    }
    ctx.putImageData(topLeft, 0, 0);
    ctx.putImageData(topRight, (width - 1) * 16, 0);
    ctx.putImageData(btmLeft, 0, (height - 1) * 16);
    ctx.putImageData(btmRight, (width - 1) * 16, (height - 1) * 16);
    for (let i = 1; i < width - 1; i++) {
        ctx.putImageData(topCenter, i * 16, 0);
        ctx.putImageData(btmCenter, i * 16, (height - 1) * 16);
    }
    for (let i = 1; i < height - 1; i++) {
        ctx.putImageData(midLeft, 0, i * 16);
        ctx.putImageData(midRight, (width - 1) * 16, i * 16);
    }
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
}
function grass_like_image(objNum, settings, tileset = 0, leftBlock = 0x131, centerBlock = 0x131, rightBlock = 0x131) {
    const canvas = document.createElement("canvas");
    const height = getHeight(objNum, settings, tileset);
    const width = getWidth(objNum, settings, tileset);
    canvas.width = width * 16;
    canvas.height = height * 16;
    const ctx = canvas.getContext("2d");
    ctx.putImageData(grass_like_image_real(objNum, settings, tileset, leftBlock, centerBlock, rightBlock), 0, 0);
    return canvas.toDataURL('image/png');
}
function grass_like_image_real(objNum, settings, tileset = 0, leftBlock = 0x131, centerBlock = 0x131, rightBlock = 0x131) {
    const canvas = document.createElement("canvas");
    const height = getHeight(objNum, settings, tileset);
    const width = getWidth(objNum, settings, tileset);
    const left = getMap16TileImg(leftBlock);
    const center = getMap16TileImg(centerBlock);
    const right = getMap16TileImg(rightBlock);
    canvas.width = width * 16;
    canvas.height = height * 16;
    const ctx = canvas.getContext("2d");
    for (let i = 0; i < height; i++) {
        ctx.putImageData(left, 0, i * 16);
        ctx.putImageData(right, (width - 1) * 16, i * 16);
        for (let j = 1; j < width - 1; j++) {
            ctx.putImageData(center, j * 16, i * 16);
        }
    }
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
}
function grass_like_image2(objNum, settings, tileset = 0, leftBlock = 0x131, centerBlock = 0x131, rightBlock = 0x131) {
    const canvas = document.createElement("canvas");
    const height = getHeight(objNum, settings, tileset);
    const width = getWidth(objNum, settings, tileset);
    const left = getMap16TileImg(leftBlock);
    const center = getMap16TileImg(centerBlock);
    const right = getMap16TileImg(rightBlock);
    canvas.width = width * 16;
    canvas.height = height * 16;
    const ctx = canvas.getContext("2d");
    for (let i = 0; i < height; i++) {
        ctx.putImageData(right, (width - 1) * 16, i * 16);
        ctx.putImageData(left, 0, i * 16);
        for (let j = 1; j < width - 1; j++) {
            ctx.putImageData(center, j * 16, i * 16);
        }
    }
    return canvas.toDataURL('image/png');
}
function bone_like_image(objNum, settings, tileset = 0, topBlock = 0x131, midBlock = 0x131, btmBlock = 0x131) {
    const canvas = document.createElement("canvas");
    const height = getHeight(objNum, settings, tileset);
    const width = getWidth(objNum, settings, tileset);
    const top = getMap16TileImg(topBlock);
    const mid = getMap16TileImg(midBlock);
    const btm = getMap16TileImg(btmBlock);
    canvas.width = width * 16;
    canvas.height = height * 16;
    const ctx = canvas.getContext("2d");
    for (let j = 0; j < width; j++) {
        ctx.putImageData(top, j * 16, 0);
        ctx.putImageData(btm, j * 16, (height - 1) * 16);
        for (let i = 1; i < height - 1; i++) {
            ctx.putImageData(mid, j * 16, i * 16);
        }
    }
    return canvas.toDataURL('image/png');
}
function pipe_like_image(objNum, settings, tileset, topLeftBlock = 0x131, topRightBlock = 0x131, btmLeftBlock = 0x131, btmRightBlock = 0x131) {
    const canvas = document.createElement("canvas");
    const width = getWidth(objNum, settings, tileset);
    const height = getHeight(objNum, settings, tileset);
    let topleft;
    let topright;
    let btmleft;
    let btmright;
    topleft = getMap16TileImg(topLeftBlock);
    topright = getMap16TileImg(topRightBlock);
    btmleft = getMap16TileImg(btmLeftBlock);
    btmright = getMap16TileImg(btmRightBlock);
    canvas.width = width * 16;
    canvas.height = height * 16;
    const ctx = canvas.getContext("2d");
    for (let j = 0; j < height; j++) {
        ctx.putImageData(btmleft, 0, j * 16);
        ctx.putImageData(btmright, 16, j * 16);
    }
    ctx.putImageData(topleft, 0, 0);
    ctx.putImageData(topright, 16, 0);
    return canvas.toDataURL('image/png');
}
function bridge_like_image(objNum, settings, tileset = 0, topBlock = 0x131, btmBlock = 0x131) {
    const canvas = document.createElement("canvas");
    const width = getWidth(objNum, settings, tileset);
    const height = getHeight(objNum, settings, tileset);
    const top = getMap16TileImg(topBlock);
    const bottom = getMap16TileImg(btmBlock);
    canvas.width = 16 * width;
    canvas.height = 16 * height;
    const ctx = canvas.getContext("2d");
    for (let i = 0; i < width; i++) {
        ctx.putImageData(top, i * 16, 0);
        ctx.putImageData(bottom, i * 16, 16);
    }
    return canvas.toDataURL('image/png');
}
function single_block_image(objNum, settings, tileset = 0, m16Num = 0x131) {
    const canvas = document.createElement("canvas");
    const width = getWidth(objNum, settings, tileset);
    const height = getHeight(objNum, settings, tileset);
    canvas.width = 16 * width;
    canvas.height = 16 * height;
    const ctx = canvas.getContext("2d");
    let top = getMap16TileImg(m16Num);
    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            ctx.putImageData(top, i * 16, j * 16);
        }
    }
    return canvas.toDataURL('image/png');
}
function undefined_obj_image(objNum, settings, tileset = 0) {
    const canvas = document.createElement("canvas");
    const width = getWidth(objNum, settings, tileset);
    const height = getHeight(objNum, settings, tileset);
    canvas.width = 16 * width;
    canvas.height = 16 * height;
    const ctx = canvas.getContext("2d");
    let top = getMap16TileImg(0x131);
    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            ctx.putImageData(top, i * 16, j * 16);
        }
    }
    return canvas.toDataURL('image/png');
}
function rev_normal_slope_image(objNum, settings, tileset = 0, topLeftBlock = 0x131, topRightBlock = 0x131, btmLeftBlock = 0x131, btmRightBlock = 0x131, btmBlock = 0x131) {
    const canvas = document.createElement("canvas");
    const width = getWidth(objNum, settings, tileset);
    const height = getHeight(objNum, settings, tileset);
    const topLeft = getMap16TileImg(topLeftBlock);
    const topRight = getMap16TileImg(topRightBlock);
    const btmLeft = getMap16TileImg(btmLeftBlock);
    const btmRight = getMap16TileImg(btmRightBlock);
    const btm = getMap16TileImg(btmBlock);
    canvas.width = 16 * width;
    canvas.height = 16 * height;
    const ctx = canvas.getContext("2d");
    const w = intdiv(width, 2);
    for (let i = 0; i < w; i++) {
        ctx.putImageData(topLeft, (i * 2) * 16, i * 16);
        ctx.putImageData(topRight, (i * 2 + 1) * 16, i * 16);
        ctx.putImageData(btmLeft, (i * 2) * 16, (i + 1) * 16);
        ctx.putImageData(btmRight, (i * 2 + 1) * 16, (i + 1) * 16);
        for (let j = 0; j < i; j++) {
            ctx.putImageData(btm, (i * 2 + 0) * 16, j * 16);
            ctx.putImageData(btm, (i * 2 + 1) * 16, j * 16);
        }
    }
    return canvas.toDataURL('image/png');
}
function hill_image(objNum, settings, tileset) {
    const canvas = document.createElement("canvas");
    const width = getWidth(objNum, settings, tileset);
    const height = getHeight(objNum, settings, tileset);
    const a = ((settings >> 4) & 0b1111);
    const b = ((settings >> 0) & 0b1111);
    canvas.width = 16 * width;
    canvas.height = 16 * height;
    const ctx = canvas.getContext("2d");
    const ground = getMap16TileImg(0x1AA);
    const ground_down = getMap16TileImg(0x1E2);
    const dirt = getMap16TileImg(0x3F);
    const coltop = getMap16TileImg(0xA1);
    const coldown = getMap16TileImg(0x1F7);
    const left = getMap16TileImg(0xA3);
    const right = getMap16TileImg(0xA6);
    const length = 2 * b + 1;
    for (let i = 0; i < b + 1; i++) {
        ctx.putImageData(ground, i * 16, (b - i) * 16);
        ctx.putImageData(ground_down, (i + 1) * 16, (b - i) * 16);
        for (let j = i + 2; j < b + 1; j++) {
            ctx.putImageData(dirt, j * 16, (b - i) * 16);
        }
    }
    for (let i = 0; i < (b + 1); i++) {
        ctx.putImageData(right, ((b + 1) + i) * 16, i * 16);
        for (let j = 0; j < i; j++) {
            ctx.putImageData(dirt, ((b + 1) + j) * 16, i * 16);
        }
    }
    for (let i = (b + 1); i < height; i++) {
        ctx.putImageData(right, ((b + 1) + i) * 16, i * 16);
    }
    for (let i = (b + 1); i < height; i++) {
        ctx.putImageData(left, (i - (b + 1)) * 16, i * 16);
        for (let j = ((i - (b + 1)) + 1); j < length + (i - (b + 1)) + 1; j++) {
            ctx.putImageData(dirt, j * 16, i * 16);
        }
    }
    ctx.putImageData(coldown, 0, (b + 1) * 16);
    ctx.putImageData(coltop, (b + 1) * 16, 0);
    return canvas.toDataURL("image/png");
}
function canvas_image(objNum, settings, tileset) {
    const result = canvas_image_real(objNum, settings, tileset);
    const canvas = document.createElement("canvas");
    const width = getWidth(objNum, settings, tileset);
    const height = getHeight(objNum, settings, tileset);
    canvas.width = 16 * width;
    canvas.height = 16 * height;
    const ctx = canvas.getContext("2d");
    ctx.putImageData(result, 0, 0);
    return canvas.toDataURL("image/png");
}
function canvas3_image(objNum, settings, tileset) {
    const result = canvas_image_real(objNum, settings, tileset);
    const canvas = document.createElement("canvas");
    const width = getWidth(objNum, settings, tileset);
    const height = getHeight(objNum, settings, tileset);
    canvas.width = 16 * width;
    canvas.height = 16 * height;
    const ctx = canvas.getContext("2d");
    ctx.putImageData(result, 0, 0);
    const top_hole = getMap16TileImg(0x7D);
    const mid_hole = getMap16TileImg(0x7E);
    const btm_hole = getMap16TileImg(0x7F);
    ctx.putImageData(top_hole, 1 * 16, 1 * 16);
    ctx.putImageData(mid_hole, 1 * 16, 2 * 16);
    ctx.putImageData(btm_hole, 0 * 16, 4 * 16);
    return canvas.toDataURL("image/png");
}
function canvas4_image(objNum, settings, tileset) {
    const result = canvas2_image_real(objNum, settings, tileset);
    const canvas = document.createElement("canvas");
    const width = getWidth(objNum, settings, tileset);
    const height = getHeight(objNum, settings, tileset);
    canvas.width = 16 * width;
    canvas.height = 16 * height;
    const ctx = canvas.getContext("2d");
    ctx.putImageData(result, 0, 0);
    const top1 = getMap16TileImg(0x81);
    const top2 = getMap16TileImg(0x82);
    const top3 = getMap16TileImg(0x83);
    const btm1 = getMap16TileImg(0x84);
    const btm2 = getMap16TileImg(0x85);
    const btm3 = getMap16TileImg(0x86);
    ctx.putImageData(top2, 1 * 16, 1 * 16);
    ctx.putImageData(btm2, 1 * 16, 2 * 16);
    ctx.putImageData(top3, 2 * 16, 1 * 16);
    ctx.putImageData(btm3, 2 * 16, 2 * 16);
    ctx.putImageData(top1, 0 * 16, 3 * 16);
    ctx.putImageData(btm1, 0 * 16, 4 * 16);
    return canvas.toDataURL("image/png");
}
function canvasses_image(objNum, settings, tileset) {
    const canvas = document.createElement("canvas");
    const width = getWidth(objNum, settings, tileset);
    const height = getHeight(objNum, settings, tileset);
    canvas.width = 16 * width;
    canvas.height = 16 * height;
    const ledge = getMap16TileImg(0x161);
    const cvs = canvas_image_real(objNum, settings, tileset);
    const ctx = canvas.getContext("2d");
    for (let i = 0; i < height; i += 4) {
        for (let j = 0; j < width; j++) {
            ctx.putImageData(ledge, j * 16, i * 16);
        }
    }
    for (let i = 0; i < 4; i++) {
        if (i % 2 === 0) {
            for (let j = 0; j < width; j += 8) {
                ctx.putImageData(cvs, j * 16, (i * 4) * 16);
            }
        }
        else {
            for (let j = 4; j < width; j += 8) {
                ctx.putImageData(cvs, j * 16, (i * 4) * 16);
            }
        }
    }
    return canvas.toDataURL("image/png");
}
function canvas2_image(objNum, settings, tileset) {
    const result = canvas2_image_real(objNum, settings, tileset);
    const canvas = document.createElement("canvas");
    const width = getWidth(objNum, settings, tileset);
    const height = getHeight(objNum, settings, tileset);
    canvas.width = 16 * width;
    canvas.height = 16 * height;
    const ctx = canvas.getContext("2d");
    ctx.putImageData(result, 0, 0);
    return canvas.toDataURL("image/png");
}
function canvas2_image_real(objNum, settings, tileset) {
    const canvas = document.createElement("canvas");
    const width = getWidth(objNum, settings, tileset);
    const height = getHeight(objNum, settings, tileset);
    canvas.width = 16 * 4;
    canvas.height = 16 * 6;
    const top1 = getMap16TileImg(0x77);
    const top2 = getMap16TileImg(0x78);
    const top3 = getMap16TileImg(0x79);
    const btm1 = getMap16TileImg(0x7A);
    const btm2 = getMap16TileImg(0x7B);
    const btm3 = getMap16TileImg(0x7C);
    const curtainTopLeft = getMap16TileImg(0x15C);
    const curtainTop = getMap16TileImg(0x15D);
    const curtainTopRight = getMap16TileImg(0x15E);
    const curtainBottom = getMap16TileImg(0x76);
    const curtainLedge = getMap16TileImg(0x15F);
    const curtainTopLedge = getMap16TileImg(0x160);
    const ctx = canvas.getContext("2d");
    ctx.putImageData(curtainTopLeft, 0 * 16, 0 * 16);
    ctx.putImageData(curtainTop, 1 * 16, 0 * 16);
    ctx.putImageData(curtainTopRight, 2 * 16, 0 * 16);
    ctx.putImageData(curtainTopLedge, 3 * 16, 0 * 16);
    ctx.putImageData(top1, 0 * 16, 1 * 16);
    ctx.putImageData(top2, 1 * 16, 1 * 16);
    ctx.putImageData(top3, 2 * 16, 1 * 16);
    ctx.putImageData(btm1, 0 * 16, 2 * 16);
    ctx.putImageData(btm2, 1 * 16, 2 * 16);
    ctx.putImageData(btm3, 2 * 16, 2 * 16);
    ctx.putImageData(top1, 0 * 16, 3 * 16);
    ctx.putImageData(top2, 1 * 16, 3 * 16);
    ctx.putImageData(top3, 2 * 16, 3 * 16);
    ctx.putImageData(btm1, 0 * 16, 4 * 16);
    ctx.putImageData(btm2, 1 * 16, 4 * 16);
    ctx.putImageData(btm3, 2 * 16, 4 * 16);
    for (let i = 0; i < 3; i++) {
        ctx.putImageData(curtainBottom, i * 16, 5 * 16);
    }
    ctx.putImageData(curtainLedge, 3 * 16, 4 * 16);
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
}
function canvas_image_real(objNum, settings, tileset) {
    const canvas = document.createElement("canvas");
    const width = getWidth(objNum, settings, tileset);
    const height = getHeight(objNum, settings, tileset);
    canvas.width = 16 * 4;
    canvas.height = 16 * 6;
    console.log(width);
    console.log(height);
    const curtain = getMap16TileImg(0x74);
    const curtain2 = getMap16TileImg(0x163);
    const curtainLeft = getMap16TileImg(0x73);
    const curtainRight = getMap16TileImg(0x75);
    const curtainTopLeft = getMap16TileImg(0x15C);
    const curtainTop = getMap16TileImg(0x15D);
    const curtainTopRight = getMap16TileImg(0x15E);
    const curtainBottom = getMap16TileImg(0x76);
    const curtainLedge = getMap16TileImg(0x15F);
    const curtainTopLedge = getMap16TileImg(0x160);
    const ctx = canvas.getContext("2d");
    ctx.putImageData(curtainTopLeft, 0 * 16, 0 * 16);
    ctx.putImageData(curtainTop, 1 * 16, 0 * 16);
    ctx.putImageData(curtainTopRight, 2 * 16, 0 * 16);
    ctx.putImageData(curtainTopLedge, 3 * 16, 0 * 16);
    for (let i = 0; i < 4; i++) {
        ctx.putImageData(curtainLeft, 0 * 16, (i + 1) * 16);
        ctx.putImageData(curtain, 1 * 16, (i + 1) * 16);
        ctx.putImageData(curtainRight, 2 * 16, (i + 1) * 16);
    }
    for (let i = 0; i < 3; i++) {
        ctx.putImageData(curtainBottom, i * 16, 5 * 16);
    }
    ctx.putImageData(curtainLedge, 3 * 16, 4 * 16);
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
}
function hill_rev_image(objNum, settings, tileset) {
    const canvas = document.createElement("canvas");
    const width = getWidth(objNum, settings, tileset);
    const height = getHeight(objNum, settings, tileset);
    const a = ((settings >> 4) & 0b1111);
    const b = ((settings >> 0) & 0b1111);
    canvas.width = 16 * width;
    canvas.height = 16 * height;
    const ctx = canvas.getContext("2d");
    const ground = getMap16TileImg(0x1AF);
    const ground_down = getMap16TileImg(0x1E4);
    const dirt = getMap16TileImg(0x3F);
    const coltop = getMap16TileImg(0xAF);
    const coldown = getMap16TileImg(0x1F9);
    const left = getMap16TileImg(0xA9);
    const right = getMap16TileImg(0xAC);
    for (let i = 0; i < b + 1; i++) {
        ctx.putImageData(ground, (width - (b + 1) + i) * 16, i * 16);
        ctx.putImageData(ground_down, (width - (b + 1) + i - 1) * 16, i * 16);
        for (let j = 0; j < i; j++) {
            ctx.putImageData(dirt, (width - (b + 1) + j - 1) * 16, i * 16);
        }
    }
    const length = width - height + b + 1;
    for (let i = 0; i < height - (b + 1); i++) {
        ctx.putImageData(left, i * 16, ((height - i - 1)) * 16);
        for (let j = i + 1; j < (i + 1) + length; j++) {
            ctx.putImageData(dirt, j * 16, ((height - i - 1)) * 16);
        }
    }
    for (let i = height - (b + 1); i < height; i++) {
        ctx.putImageData(left, i * 16, (height - i - 1) * 16);
        for (let j = i + 1; j < (width - (b + 1)); j++) {
            ctx.putImageData(dirt, j * 16, (height - i - 1) * 16);
        }
    }
    for (let i = b + 1; i < height; i++) {
        ctx.putImageData(right, ((width - 1) - (i - (b + 1))) * 16, i * 16);
    }
    ctx.putImageData(coltop, (width - (b + 1) - 1) * 16, 0);
    ctx.putImageData(coldown, (width - 1) * 16, ((b + 1)) * 16);
    return canvas.toDataURL("image/png");
}
function diagonal_pipe_image(objNum, settings, tileset) {
    const canvas = document.createElement("canvas");
    let width = getWidth(objNum, settings, tileset);
    let height = getHeight(objNum, settings, tileset);
    const ground = getMap16TileImg(0x1EB);
    const blank = getMap16TileImg(0x25);
    const topLeft = getMap16TileImg(0x1C4);
    const topMid = getMap16TileImg(0x1C5);
    const midRight = getMap16TileImg(0x1C6);
    const midCenter = getMap16TileImg(0x1ED);
    const midLeft = getMap16TileImg(0x1EC);
    const body1 = getMap16TileImg(0x1C7);
    const body2 = getMap16TileImg(0x1EE);
    const body3 = getMap16TileImg(0x159);
    const body4 = getMap16TileImg(0x15B);
    const body5 = getMap16TileImg(0x15C);
    const downRight = getMap16TileImg(0x15A);
    const downRight2 = getMap16TileImg(0x1EF);
    canvas.width = 16 * width;
    canvas.height = 16 * height;
    const ctx = canvas.getContext("2d");
    ctx.putImageData(topLeft, (width - 3) * 16, 0);
    ctx.putImageData(topMid, (width - 2) * 16, 0);
    ctx.putImageData(midRight, (width - 1) * 16, 16);
    ctx.putImageData(midCenter, (width - 2) * 16, 16);
    ctx.putImageData(midLeft, (width - 3) * 16, 16);
    ctx.putImageData(body1, (width - 4) * 16, 16);
    ctx.putImageData(body1, (width - 5) * 16, 32);
    ctx.putImageData(body2, (width - 4) * 16, 32);
    ctx.putImageData(body3, (width - 3) * 16, 32);
    ctx.putImageData(downRight, (width - 2) * 16, 32);
    ctx.putImageData(downRight2, (width - 1) * 16, 32);
    for (let i = 0; i < width - 5; i++) {
        ctx.putImageData(body1, (i + 0) * 16, (height - 1 - 1 - i) * 16);
        ctx.putImageData(body2, (i + 1) * 16, (height - 1 - 1 - i) * 16);
        ctx.putImageData(body3, (i + 2) * 16, (height - 1 - 1 - i) * 16);
        ctx.putImageData(body4, (i + 3) * 16, (height - 1 - 1 - i) * 16);
        ctx.putImageData(body5, (i + 4) * 16, (height - 1 - 1 - i) * 16);
    }
    ctx.putImageData(ground, 0, (height - 1) * 16);
    ctx.putImageData(blank, 1 * 16, (height - 1) * 16);
    ctx.putImageData(blank, 2 * 16, (height - 1) * 16);
    ctx.putImageData(blank, 3 * 16, (height - 1) * 16);
    ctx.putImageData(blank, 4 * 16, (height - 1) * 16);
    ctx.putImageData(blank, 5 * 16, (height - 1) * 16);
    return canvas.toDataURL("image/png");
}
function rev_normal_slope_2_image(objNum, settings, tileset = 0, topLeftBlock = 0x131, topRightBlock = 0x131, btmLeftBlock = 0x131, btmRightBlock = 0x131, btmBlock = 0x131) {
    const canvas = document.createElement("canvas");
    const width = getWidth(objNum, settings, tileset);
    const height = getHeight(objNum, settings, tileset);
    const topLeft = getMap16TileImg(topLeftBlock);
    const topRight = getMap16TileImg(topRightBlock);
    const btmLeft = getMap16TileImg(btmLeftBlock);
    const btmRight = getMap16TileImg(btmRightBlock);
    const btm = getMap16TileImg(btmBlock);
    canvas.width = 16 * width;
    canvas.height = 16 * height;
    const ctx = canvas.getContext("2d");
    const w = intdiv(width, 2);
    for (let i = 0; i < w; i++) {
        ctx.putImageData(topRight, ((width - 1) - (i * 2)) * 16, i * 16);
        ctx.putImageData(topLeft, (((width - 1) - (i * 2)) - 1) * 16, i * 16);
        ctx.putImageData(btmRight, (((width - 1) - (i * 2))) * 16, (i + 1) * 16);
        ctx.putImageData(btmLeft, (((width - 1) - (i * 2)) - 1) * 16, (i + 1) * 16);
        /*
        for (let j = 0; j < i; j++) {
            ctx!.putImageData(btm, (i*2 + 0) * 16, j * 16);
            ctx!.putImageData(btm, (i*2 + 1) * 16, j * 16);
        }
        */
        for (let j = 0; j < i; j++) {
            ctx.putImageData(btm, ((width - 1) - (i * 2)) * 16, j * 16);
            ctx.putImageData(btm, (((width - 1) - (i * 2)) - 1) * 16, j * 16);
        }
    }
    return canvas.toDataURL('image/png');
}
function normal_slope_image(objNum, settings, tileset = 0, topLeftBlock = 0x131, topRightBlock = 0x131, btmLeftBlock = 0x131, btmRightBlock = 0x131, btmBlock = 0x131) {
    const canvas = document.createElement("canvas");
    const width = getWidth(objNum, settings, tileset);
    const height = getHeight(objNum, settings, tileset);
    const topLeft = getMap16TileImg(topLeftBlock);
    const topRight = getMap16TileImg(topRightBlock);
    const btmLeft = getMap16TileImg(btmLeftBlock);
    const btmRight = getMap16TileImg(btmRightBlock);
    const btm = getMap16TileImg(btmBlock);
    canvas.width = 16 * width;
    canvas.height = 16 * height;
    const ctx = canvas.getContext("2d");
    const w = intdiv(width, 2);
    for (let i = 0; i < w; i++) {
        ctx.putImageData(topLeft, (i * 2) * 16, i * 16);
        ctx.putImageData(topRight, (i * 2 + 1) * 16, i * 16);
        ctx.putImageData(btmLeft, (i * 2) * 16, (i + 1) * 16);
        ctx.putImageData(btmRight, (i * 2 + 1) * 16, (i + 1) * 16);
        for (let j = (i + 1) + 1; j < height; j++) {
            ctx.putImageData(btm, (i * 2 + 0) * 16, j * 16);
            ctx.putImageData(btm, (i * 2 + 1) * 16, j * 16);
        }
    }
    return canvas.toDataURL('image/png');
}
function normal_slope_2_image(objNum, settings, tileset = 0, topLeftBlock = 0x131, topRightBlock = 0x131, btmLeftBlock = 0x131, btmRightBlock = 0x131, btmBlock = 0x131) {
    const canvas = document.createElement("canvas");
    const width = getWidth(objNum, settings, tileset);
    const height = getHeight(objNum, settings, tileset);
    const topLeft = getMap16TileImg(topLeftBlock);
    const topRight = getMap16TileImg(topRightBlock);
    const btmLeft = getMap16TileImg(btmLeftBlock);
    const btmRight = getMap16TileImg(btmRightBlock);
    const btm = getMap16TileImg(btmBlock);
    canvas.width = 16 * width;
    canvas.height = 16 * height;
    const ctx = canvas.getContext("2d");
    const w = intdiv(width, 2);
    for (let i = 0; i < w; i++) {
        ctx.putImageData(topLeft, (((w - i - 1) * 2) + 0) * 16, i * 16);
        ctx.putImageData(topRight, (((w - i - 1) * 2) + 1) * 16, i * 16);
        ;
        ctx.putImageData(btmLeft, (((w - i - 1) * 2) + 0) * 16, (i + 1) * 16);
        ;
        ctx.putImageData(btmRight, (((w - i - 1) * 2) + 1) * 16, (i + 1) * 16);
        ;
        for (let j = (i + 1) + 1; j < height; j++) {
            ctx.putImageData(btm, (((w - i - 1) * 2) + 0) * 16, j * 16);
            ctx.putImageData(btm, (((w - i - 1) * 2) + 1) * 16, j * 16);
        }
    }
    return canvas.toDataURL('image/png');
}
function steep_slope_image(objNum, settings, tileset = 0, topBlock = 0x131, midBlock = 0x131, btmBlock = 0x131) {
    const canvas = document.createElement("canvas");
    const width = getWidth(objNum, settings, tileset);
    const height = getHeight(objNum, settings, tileset);
    const top = getMap16TileImg(topBlock);
    const mid = getMap16TileImg(midBlock);
    const btm = getMap16TileImg(btmBlock);
    canvas.width = 16 * width;
    canvas.height = 16 * height;
    const ctx = canvas.getContext("2d");
    for (let i = 0; i < width; i++) {
        ctx.putImageData(top, i * 16, i * 16);
        ctx.putImageData(mid, i * 16, (i + 1) * 16);
        for (let j = i + 2; j < height; j++) {
            ctx.putImageData(btm, i * 16, j * 16);
        }
    }
    return canvas.toDataURL('image/png');
}
function steep_slope_2_image(objNum, settings, tileset = 0, topBlock = 0x131, midBlock = 0x131, btmBlock = 0x131) {
    const canvas = document.createElement("canvas");
    const width = getWidth(objNum, settings, tileset);
    const height = getHeight(objNum, settings, tileset);
    const top = getMap16TileImg(topBlock);
    const mid = getMap16TileImg(midBlock);
    const btm = getMap16TileImg(btmBlock);
    canvas.width = 16 * width;
    canvas.height = 16 * height;
    const ctx = canvas.getContext("2d");
    const w = width;
    for (let i = 0; i < width; i++) {
        ctx.putImageData(top, (w - i - 1) * 16, i * 16);
        ctx.putImageData(mid, (w - i - 1) * 16, (i + 1) * 16);
        for (let j = i + 2; j < height; j++) {
            ctx.putImageData(btm, (w - i - 1) * 16, j * 16);
        }
    }
    return canvas.toDataURL('image/png');
}
function rev_steep_slope_image(objNum, settings, tileset = 0, topBlock = 0x131, midBlock = 0x131, btmBlock = 0x131) {
    const canvas = document.createElement("canvas");
    const width = getWidth(objNum, settings, tileset);
    const height = getHeight(objNum, settings, tileset);
    const top = getMap16TileImg(topBlock);
    const mid = getMap16TileImg(midBlock);
    const btm = getMap16TileImg(btmBlock);
    canvas.width = 16 * width;
    canvas.height = 16 * height;
    const ctx = canvas.getContext("2d");
    for (let i = 0; i < width; i++) {
        ctx.putImageData(top, i * 16, i * 16);
        ctx.putImageData(mid, i * 16, (i + 1) * 16);
        for (let j = 0; j < i; j++) {
            ctx.putImageData(btm, i * 16, j * 16);
        }
    }
    return canvas.toDataURL('image/png');
}
function rev_steep_slope_2_image(objNum, settings, tileset = 0, topBlock = 0x131, midBlock = 0x131, btmBlock = 0x131) {
    const canvas = document.createElement("canvas");
    const width = getWidth(objNum, settings, tileset);
    const height = getHeight(objNum, settings, tileset);
    const top = getMap16TileImg(topBlock);
    const mid = getMap16TileImg(midBlock);
    const btm = getMap16TileImg(btmBlock);
    canvas.width = 16 * width;
    canvas.height = 16 * height;
    const ctx = canvas.getContext("2d");
    for (let i = 0; i < width; i++) {
        ctx.putImageData(top, ((width - 1) - i) * 16, (i + 0) * 16);
        ctx.putImageData(mid, ((width - 1) - i) * 16, (i + 1) * 16);
        for (let j = 0; j < i; j++) {
            ctx.putImageData(btm, ((width - 1) - i) * 16, j * 16);
        }
    }
    return canvas.toDataURL('image/png');
}
function very_steep_slope_image(objNum, settings, tileset = 0, topBlock = 0x131, midBlock = 0x131, btmBlock = 0x131, dirtBlock = 0x131) {
    const canvas = document.createElement("canvas");
    const width = getWidth(objNum, settings, tileset);
    const height = getHeight(objNum, settings, tileset);
    const top = getMap16TileImg(topBlock);
    const mid = getMap16TileImg(midBlock);
    const btm = getMap16TileImg(btmBlock);
    const dirt = getMap16TileImg(dirtBlock);
    canvas.width = 16 * width;
    canvas.height = 16 * height;
    const ctx = canvas.getContext("2d");
    const w = width;
    for (let i = 0; i < width; i++) {
        ctx.putImageData(top, i * 16, ((i * 2) + 0) * 16);
        ctx.putImageData(mid, i * 16, ((i * 2) + 1) * 16);
        ctx.putImageData(btm, i * 16, ((i * 2) + 2) * 16);
        for (let j = ((i * 2) + 3); j < height; j++) {
            ctx.putImageData(dirt, i * 16, j * 16);
        }
    }
    return canvas.toDataURL('image/png');
}
function very_steep_slope_2_image(objNum, settings, tileset = 0, topBlock = 0x131, midBlock = 0x131, btmBlock = 0x131, dirtBlock = 0x131) {
    const canvas = document.createElement("canvas");
    const width = getWidth(objNum, settings, tileset);
    const height = getHeight(objNum, settings, tileset);
    const top = getMap16TileImg(topBlock);
    const mid = getMap16TileImg(midBlock);
    const btm = getMap16TileImg(btmBlock);
    const dirt = getMap16TileImg(dirtBlock);
    canvas.width = 16 * width;
    canvas.height = 16 * height;
    const ctx = canvas.getContext("2d");
    const w = width;
    for (let i = 0; i < width; i++) {
        ctx.putImageData(top, (w - i - 1) * 16, ((i * 2) + 0) * 16);
        ctx.putImageData(mid, (w - i - 1) * 16, ((i * 2) + 1) * 16);
        ctx.putImageData(btm, (w - i - 1) * 16, ((i * 2) + 2) * 16);
        for (let j = ((i * 2) + 3); j < height; j++) {
            ctx.putImageData(dirt, (w - i - 1 + 0) * 16, j * 16);
        }
    }
    return canvas.toDataURL('image/png');
}
function gradual_slope_image(objNum, settings, tileset = 0, firstBlock = 0x131, secondBlock = 0x131, thirdBlock = 0x131, forthBlock = 0x131, firstDownBlock = 0x131, secondDownBlock = 0x131, thirdDownBlock = 0x131, forthDownBlock = 0x131, dirtBlock = 0x131) {
    const canvas = document.createElement("canvas");
    const width = getWidth(objNum, settings, tileset);
    const height = getHeight(objNum, settings, tileset);
    const first = getMap16TileImg(firstBlock);
    const second = getMap16TileImg(secondBlock);
    const third = getMap16TileImg(thirdBlock);
    const forth = getMap16TileImg(forthBlock);
    const firstDown = getMap16TileImg(firstDownBlock);
    const secondDown = getMap16TileImg(secondDownBlock);
    const thirdDown = getMap16TileImg(thirdDownBlock);
    const forthDown = getMap16TileImg(forthDownBlock);
    const dirt = getMap16TileImg(dirtBlock);
    canvas.width = 16 * width;
    canvas.height = 16 * height;
    const ctx = canvas.getContext("2d");
    const w = intdiv(width, 4);
    for (let i = 0; i < width; i++) {
        ctx.putImageData(first, (i * 4 + 0) * 16, (i) * 16);
        ctx.putImageData(second, (i * 4 + 1) * 16, (i) * 16);
        ctx.putImageData(third, (i * 4 + 2) * 16, (i) * 16);
        ctx.putImageData(forth, (i * 4 + 3) * 16, (i) * 16);
        ctx.putImageData(firstDown, (i * 4 + 0) * 16, (i + 1) * 16);
        ctx.putImageData(secondDown, (i * 4 + 1) * 16, (i + 1) * 16);
        ctx.putImageData(thirdDown, (i * 4 + 2) * 16, (i + 1) * 16);
        ctx.putImageData(forthDown, (i * 4 + 3) * 16, (i + 1) * 16);
        for (let j = i + 2; j < height; j++) {
            ctx.putImageData(dirt, (i * 4 + 0) * 16, j * 16);
            ctx.putImageData(dirt, (i * 4 + 1) * 16, j * 16);
            ctx.putImageData(dirt, (i * 4 + 2) * 16, j * 16);
            ctx.putImageData(dirt, (i * 4 + 3) * 16, j * 16);
        }
    }
    return canvas.toDataURL('image/png');
}
function gradual_slope_2_image(objNum, settings, tileset = 0, firstBlock = 0x131, secondBlock = 0x131, thirdBlock = 0x131, forthBlock = 0x131, firstDownBlock = 0x131, secondDownBlock = 0x131, thirdDownBlock = 0x131, forthDownBlock = 0x131, dirtBlock = 0x131) {
    const canvas = document.createElement("canvas");
    const width = getWidth(objNum, settings, tileset);
    const height = getHeight(objNum, settings, tileset);
    const first = getMap16TileImg(firstBlock);
    const second = getMap16TileImg(secondBlock);
    const third = getMap16TileImg(thirdBlock);
    const forth = getMap16TileImg(forthBlock);
    const firstDown = getMap16TileImg(firstDownBlock);
    const secondDown = getMap16TileImg(secondDownBlock);
    const thirdDown = getMap16TileImg(thirdDownBlock);
    const forthDown = getMap16TileImg(forthDownBlock);
    const dirt = getMap16TileImg(dirtBlock);
    canvas.width = 16 * width;
    canvas.height = 16 * height;
    const ctx = canvas.getContext("2d");
    const w = intdiv(width, 4);
    for (let i = 0; i < width; i++) {
        ctx.putImageData(first, (((w - i - 1) * 4) + 0) * 16, (i) * 16);
        ctx.putImageData(second, (((w - i - 1) * 4) + 1) * 16, (i) * 16);
        ctx.putImageData(third, (((w - i - 1) * 4) + 2) * 16, (i) * 16);
        ctx.putImageData(forth, (((w - i - 1) * 4) + 3) * 16, (i) * 16);
        ctx.putImageData(firstDown, (((w - i - 1) * 4) + 0) * 16, (i + 1) * 16);
        ctx.putImageData(secondDown, (((w - i - 1) * 4) + 1) * 16, (i + 1) * 16);
        ctx.putImageData(thirdDown, (((w - i - 1) * 4) + 2) * 16, (i + 1) * 16);
        ctx.putImageData(forthDown, (((w - i - 1) * 4) + 3) * 16, (i + 1) * 16);
        for (let j = i + 2; j < height; j++) {
            ctx.putImageData(dirt, (((w - i - 1) * 4) + 0) * 16, j * 16);
            ctx.putImageData(dirt, (((w - i - 1) * 4) + 1) * 16, j * 16);
            ctx.putImageData(dirt, (((w - i - 1) * 4) + 2) * 16, j * 16);
            ctx.putImageData(dirt, (((w - i - 1) * 4) + 3) * 16, j * 16);
        }
    }
    return canvas.toDataURL('image/png');
}
function getSprImg4x4(tiles, color, flipx = false) {
    const canvas = document.createElement("canvas");
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext("2d");
    const result = [];
    for (let i = 0; i < 4; i++) {
        if (tiles[i] !== null) {
            if (flipx) {
                result[i] = getSpr8x8Img(tiles[i], color, true);
            }
            else {
                result[i] = getSpr8x8Img(tiles[i], color);
            }
        }
        else {
            result[i] = null;
        }
    }
    for (let i = 0; i < 4; i++) {
        if (result[i] !== null) {
            if (flipx) {
                ctx.putImageData(result[i], (1 - (i % 2)) * 8, intdiv(i, 2) * 8);
            }
            else {
                ctx.putImageData(result[i], (i % 2) * 8, intdiv(i, 2) * 8);
            }
        }
    }
    return canvas.toDataURL('image/png');
}
function getSprImg(sprNum = 0, extra = 0) {
    const canvas = document.createElement("canvas");
    if (extra !== 0) {
        return getSprImg4x4([0x0, 0x1, 0x10, 0x11], 0x9);
    }
    switch (sprNum) {
        case 0x8A:
            // bird
            return getSprImg4x4([null, null, null, 0x1D1], 0xA, true);
            break;
        case 0xC6:
            // dark room with spot light
            return getSprImg4x4([0x180, 0x181, 0x190, 0x191], 0xE);
            break;
        case 0xC2:
            // blurp fish
            return getSprImg4x4([0x1A2, 0x1A3, 0x1B2, 0x1B3], 0xD);
            break;
        case 0xBE:
            // swooper bat
            return getSprImg4x4([0x1AE, 0x1AF, 0x1BE, 0x1BF], 0xD);
            break;
        case 0xB6:
            // reflecting fireball
            return getSprImg4x4([0x1AC, 0x1AD, 0x1BC, 0x1BD], 0xA);
            break;
        case 0xB3:
            // bowser statue fireball
            return getSprImg4x4([0x133, 0x134, null, null], 0xC);
            break;
        case 0xB2:
            // falling spike
            return getSprImg4x4([0x1E0, 0x1E1, 0x1D0, 0x1D1], 0x8);
            break;
        case 0xAF:
            // boo block
            return getSprImg4x4([0x1C8, 0x1C9, 0x1D8, 0x1D9], 0x9);
            break;
        case 0xA5:
            // fuzzball
            return getSprImg4x4([0x1C8, 0x1C9, 0x1D8, 0x1D9], 0xA, true);
            break;
        case 0x70:
            // pokey
            return getSprImg4x4([0x18A, 0x18B, 0x19A, 0x19B], 0xA);
            break;
        case 0x87:
            // lakitu's cloud
            return getSprImg4x4([0x60, 0x61, 0x70, 0x71], 0x8);
            break;
        case 0x64:
            // rope mechanism
            return getSprImg4x4([0x1C0, 0x1C1, 0x1D0, 0x1D1], 0xB);
            break;
        case 0x4C:
            // exploding block
            return getSprImg4x4([0x40, 0x41, 0x50, 0x51], 0x8);
            break;
        case 0x2D:
            // baby green yoshi            
            return getSprImg4x4([0x100, 0x101, 0x110, 0x111], 0xD);
            break;
        case 0x7D:
            // ballen
            return getSprImg4x4([0x1E4, 0x1E5, 0x1F4, 0x1F5], 0x8);
        case 0x6F:
            // dino torch
            return getSprImg4x4([0x1AA, 0x1AB, 0x1BA, 0x1BB], 0xF);
            break;
        case 0x6A:
            // coin game cloud
            return getSprImg4x4([0x60, 0x61, 0x70, 0x71], 0x8);
            break;
        case 0x68:
            // fuzz ball
            return getSprImg4x4([0x1C8, 0x1C9, 0x1D8, 0x1D9], 0xA);
            break;
        case 0x51:
            // ninji
            return getSprImg4x4([0x1A7, 0x1A8, 0x1B7, 0x1B8], 0x9);
            break;
        case 0x4D:
        case 0x4E:
            // monty mole
            return getSprImg4x4([0x186, 0x187, 0x196, 0x197], 0x8);
            break;
        case 0x4A:
            // goal point sphere
            return getSprImg4x4([0x18C, 0x18D, 0x19C, 0x19D], 0xD, true);
            break;
        case 0x48:
            // diggin' chuck's rock
            return getSprImg4x4([0x1C4, 0x1C5, 0x1D4, 0x1D5], 0xE);
            break;
        case 0x3D:
            // rip van fish
            return getSprImg4x4([0x18C, 0x18D, 0x19C, 0x19D], 0xB);
            break;
        case 0x39:
            // eerie
            return getSprImg4x4([0x16A, 0x16B, 0x17A, 0x17B], 0xE);
            break;
        case 0x38:
            // eerie
            return getSprImg4x4([0x1ED, 0x1EE, 0x1FD, 0x1FE], 0xE);
            break;
        case 0x37:
            // boo
            return getSprImg4x4([0x188, 0x189, 0x198, 0x199], 0x9);
            break;
        case 0x33:
            // fireball
            {
                canvas.width = 16;
                canvas.height = 16;
                const upleft = getSpr8x8Img(0x248, 0xA);
                const upright = getSpr8x8Img(0x248, 0xA, true);
                const dnleft = getSpr8x8Img(0x258, 0xA);
                const dnright = getSpr8x8Img(0x258, 0xA, true);
                const ctx = canvas.getContext("2d");
                ctx.putImageData(upleft, 0, 0);
                ctx.putImageData(upright, 8, 0);
                ctx.putImageData(dnleft, 0, 8);
                ctx.putImageData(dnright, 8, 8);
                return canvas.toDataURL("image/png");
            }
            break;
        case 0x31:
            // bony beetle
            return getSprImg4x4([0x18C, 0x18D, 0x19C, 0x19D], 0x9);
        case 0x2C:
            // yoshi egg
            return getSprImg4x4([0x100, 0x101, 0x110, 0x111], 0xB);
            break;
        case 0x2B:
            // sumo brother's lightning
            {
                const upleft = getSpr8x8Img(0x1F3, 0xA);
                const dnleft = getSpr8x8Img(0x1F3, 0xA, true, true);
                canvas.width = 16;
                canvas.height = 16;
                const ctx = canvas.getContext("2d");
                ctx.putImageData(upleft, 0, 0);
                ctx.putImageData(dnleft, 0, 8);
                return canvas.toDataURL("image/png");
            }
            break;
        case 0x27:
            // thwimp
            {
                const upleft = getSpr8x8Img(0x1A2, 0x9);
                const upright = getSpr8x8Img(0x1A2, 0x9, true);
                const dnleft = getSpr8x8Img(0x1B2, 0x9);
                const dnright = getSpr8x8Img(0x1B2, 0x9, true);
                canvas.width = 16;
                canvas.height = 16;
                const ctx = canvas.getContext("2d");
                ctx.putImageData(upleft, 0, 0);
                ctx.putImageData(upright, 8, 0);
                ctx.putImageData(dnleft, 0, 8);
                ctx.putImageData(dnright, 8, 8);
                return canvas.toDataURL("image/png");
            }
            break;
        case 0x1C:
            // bullet bill
            return getSprImg4x4([0x18E, 0x18F, 0x19E, 0x19F], 0xA);
            break;
        case 0x1B:
            // football
            return getSprImg4x4([0x18A, 0x18B, 0x19A, 0x19B], 0x8);
            break;
        case 0x16:
            // fish
            return getSprImg4x4([0x169, 0x16A, 0x179, 0x17A], 0xA);
            break;
        case 0x15:
        case 0x18:
        case 0x47:
            // fishes
            return getSprImg4x4([0x167, 0x168, 0x177, 0x178], 0xA);
            break;
        case 0x14:
            // falling spiny
            {
                const upleft = getSpr8x8Img(0x184, 0xC);
                const upright = getSpr8x8Img(0x184, 0xC, true);
                const dnleft = getSpr8x8Img(0x184, 0xC, false, true);
                const dnright = getSpr8x8Img(0x184, 0xC, true, true);
                canvas.width = 16;
                canvas.height = 16;
                const ctx = canvas.getContext("2d");
                ctx.putImageData(upleft, 0, 0);
                ctx.putImageData(upright, 8, 0);
                ctx.putImageData(dnleft, 0, 8);
                ctx.putImageData(dnright, 8, 8);
                return canvas.toDataURL("image/png");
            }
            break;
        case 0x13:
            // spiny
            return getSprImg4x4([0x182, 0x183, 0x192, 0x193], 0xC);
            break;
        case 0x11:
            // buzzy beetle
            return getSprImg4x4([0x182, 0x183, 0x192, 0x193], 0xE);
            break;
        case 0x0D:
            // bob-omb
            return getSprImg4x4([0x1CA, 0x1CB, 0x1DA, 0x1DB], 0xB);
            break;
        case 0xD1:
            // jumping fish generator
            return getSprImg4x4([0x167, 0x168, 0x177, 0x178], 0xA);
            break;
        case 0xD5:
            // bullet bill generator
            return getSprImg4x4([0xA6, 0xA7, 0xB6, 0xB7], 0x9);
            break;
        case 0xD6:
            // surround bullet bill generator
            return getSprImg4x4([0x1A4, 0x1A5, 0x1B4, 0x1B5], 0x9);
            break;
        case 0xD7:
            // diagonal bullet bill generator
            return getSprImg4x4([0x1A6, 0x1A7, 0x1B6, 0x1B7], 0x9);
            break;
        case 0xD8:
            // bowser statue fire breath generator
            return getSprImg4x4([0x133, 0x134, null, null], 0xC);
            break;
        case 0xE5:
            // reappearing ghosts
            return getSprImg4x4([0x1AE, 0x1AF, 0x1BE, 0x1BF], 0x9, true);
            break;
        case 0xE4:
            // swooper death bat ceiling
            return getSprImg4x4([0x1AE, 0x1AF, 0x1BE, 0x1BF], 0xB);
            break;
        case 0xE1:
            // ghost ceiling
            return getSprImg4x4([0x1A8, 0x1A9, 0x1B8, 0x1B9], 0x9);
            break;
        case 0xE6:
            // candle
            return getSprImg4x4([0x1E2, 0x1E3, 0x1F2, 0x1F3], 0xC);
            break;
        case 0xCB:
            // eerie generator
            return getSprImg4x4([0x1ED, 0x1EE, 0x1FD, 0x1FE], 0xE);
            break;
        case 0xC9:
            // bullet bill shooter
            return getSprImg4x4([0xA6, 0xA7, 0xB6, 0xB7], 0x9);
            break;
        case 0x45:
            // directional coin
            {
                const up = getSpr8x8Img(0xEA, 0xA);
                const dn = getSpr8x8Img(0xEA, 0xA, false, true);
                canvas.width = 16;
                canvas.height = 16;
                const ctx = canvas.getContext("2d");
                ctx.putImageData(up, 8, 0);
                ctx.putImageData(dn, 8, 8);
                return canvas.toDataURL("image/png");
            }
            break;
        case 0x2F:
            // spring board
            {
                const upleft = getSpr8x8Img(0x28, 0xD);
                const upright = getSpr8x8Img(0x28, 0xD, true);
                const dnleft = getSpr8x8Img(0x28, 0xD, false, true);
                const dnright = getSpr8x8Img(0x28, 0xD, true, true);
                canvas.width = 16;
                canvas.height = 16;
                const ctx = canvas.getContext("2d");
                ctx.putImageData(upleft, 0, 0);
                ctx.putImageData(upright, 8, 0);
                ctx.putImageData(dnleft, 0, 8);
                ctx.putImageData(dnright, 8, 8);
                return canvas.toDataURL("image/png");
            }
            break;
        case 0x0E:
            // keyhole
            return getSprImg4x4([null, 0xEB, null, 0xFB], 0x8);
            break;
        case 0xC8:
            // light switch block
            return getSprImg4x4([0x2A, 0x2B, 0x3A, 0x3B], 0xC);
            break;
        case 0xC7:
            // invisible mushroom
            return getSprImg4x4([0x24, 0x25, 0x34, 0x35], 0xC);
            break;
        case 0xBD:
            // sliding blue koopa with no shell
            return getSprImg4x4([0x86, 0x87, 0x96, 0x97], 0xB);
            break;
        case 0xB9:
            // message box
            return getSprImg4x4([0xC0, 0xC1, 0xD0, 0xD1], 0xB, true);
            break;
        case 0xB1:
            // creating eating block
            return getSprImg4x4([0x2E, 0x2F, 0x3E, 0x3F], 0x8);
        case 0x81:
            // changing item
            return getSprImg4x4([0x24, 0x25, 0x34, 0x35], 0xC);
            break;
        case 0x80:
            // key
            return getSprImg4x4([0xEC, 0xED, 0xFC, 0xFD], 0x8, true);
            break;
        case 0x79:
            // growing vine
            return getSprImg4x4([0xAE, 0xAF, 0xBE, 0xBF], 0xD);
            break;
        case 0x78:
            // green mushroom
            return getSprImg4x4([0x24, 0x25, 0x34, 0x35], 0xD);
            break;
        case 0x77:
            // feather
            return getSprImg4x4([0x0E, 0x0F, 0x1E, 0x1F], 0xA);
            break;
        case 0x76:
            // star
            return getSprImg4x4([0x48, 0x49, 0x58, 0x59], 0xA);
            break;
        case 0x75:
            // flower
            return getSprImg4x4([0x26, 0x27, 0x36, 0x37], 0xD);
            break;
        case 0x74:
            // mushroom
            return getSprImg4x4([0x24, 0x25, 0x34, 0x35], 0xC);
            break;
        case 0x6D:
            // invisible brown block
            return getSprImg4x4([0x2E, 0x2F, 0x3E, 0x3F], 0x8);
            break;
        case 0x53:
            // throw block
            return getSprImg4x4([0x40, 0x41, 0x50, 0x51], 0xB);
            break;
        case 0x3E:
            // pow switch
            return getSprImg4x4([0x42, 0x43, 0x52, 0x53], 0x9);
            break;
        case 0x21:
            // moving coin
            return getSprImg4x4([0xE8, 0xE9, 0xF8, 0xF9], 0xA);
            break;
        case 0x1C:
            // bullet bill
            return getSprImg4x4([0xA6, 0xA7, 0xB6, 0xB7], 0x9);
            break;
        case 0x0F:
            // goomba
            {
                const color = 0x0A;
                return getSprImg4x4([0xA8, 0xA9, 0xB8, 0xB9], color);
            }
            break;
        case 0xDA:
        case 0xDB:
        case 0xDC:
        case 0xDD:
        case 0xDF:
            // koopa shell
            {
                let color;
                if (sprNum === 0xDA || sprNum === 0xDF) {
                    color = 0xD;
                }
                else if (sprNum === 0xDB) {
                    color = 0xC;
                }
                else if (sprNum === 0xDD) {
                    color = 0xA;
                }
                else if (sprNum === 0xDC) {
                    color = 0xB;
                }
                else {
                    throw new Error();
                }
                return getSprImg4x4([0x8C, 0x8D, 0x9C, 0x9D], color);
            }
            break;
        case 0:
        case 1:
        case 3:
            // koopa, no shell
            {
                let color;
                if (sprNum === 0x0) {
                    color = 0xD;
                }
                else if (sprNum === 0x1) {
                    color = 0xC;
                }
                else if (sprNum === 0x3) {
                    color = 0xA;
                }
                else {
                    throw new Error();
                }
                return getSprImg4x4([0xC8, 0xC9, 0xD8, 0xD9], color);
            }
            break;
        case 2:
            // blue koopa, no shell
            {
                const color = 0x0B;
                const result1 = getSpr8x8Img(0xE0, color);
                const result2 = getSpr8x8Img(0xE1, color);
                const result3 = getSpr8x8Img(0xF0, color);
                const result4 = getSpr8x8Img(0xF1, color);
                return getSprImg4x4([0xE0, 0xE1, 0xF0, 0xF1], color);
            }
            break;
        default:
            {
                return getSprImg4x4([0x0, 0x1, 0x10, 0x11], 0x9);
            }
            break;
    }
}
function getFg8x8Img(index = 0, palette = 0) {
    index = index % 0x400;
    const canvas = document.createElement("canvas");
    canvas.width = 8;
    canvas.height = 8;
    const ctx = canvas.getContext("2d");
    const page = intdiv(index, 128);
    let gfx;
    switch (page) {
        case 0:
            gfx = fg1bmp;
            break;
        case 1:
            gfx = fg2bmp;
            break;
        case 2:
            gfx = bgbmp;
            break;
        case 3:
            gfx = fg3bmp;
            break;
        case 4:
            gfx = bg2bmp;
            break;
        case 5:
            gfx = bg3bmp;
            break;
        default:
            throw new Error();
            break;
    }
    const i = index % 128;
    const bitmap = gfx[i];
    let r, g, b;
    for (let j = 0; j < 64; j++) {
        const color = pal[palette][bitmap[j]];
        let r, g, b;
        r = color.r;
        g = color.g;
        b = color.b;
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.fillRect(j % 8, intdiv(j, 8), 1, 1);
    }
    return ctx.getImageData(0, 0, 8, 8);
}
function getSpr8x8Img(index = 0, palette = 0, flipx = false, flipy = false) {
    index = index % 0x300;
    const canvas = document.createElement("canvas");
    canvas.width = 8;
    canvas.height = 8;
    const ctx = canvas.getContext("2d");
    const page = intdiv(index, 128);
    let gfx;
    switch (page) {
        case 0:
            gfx = sp1bmp;
            break;
        case 1:
            gfx = sp2bmp;
            break;
        case 2:
            gfx = sp3bmp;
            ;
            break;
        case 3:
            gfx = sp4bmp;
            break;
        case 4:
            gfx = anibmp;
            break;
        default:
            throw new Error();
            break;
    }
    const i = index % 128;
    const bitmap = gfx[i];
    let r, g, b;
    for (let j = 0; j < 64; j++) {
        let color;
        let r, g, b;
        color = pal[palette][bitmap[j]];
        r = color.r;
        g = color.g;
        b = color.b;
        let alpha = 1.0;
        if (bitmap[j] == 0) {
            alpha = 0.0;
        }
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        if (flipx === true && flipy === false) {
            ctx.fillRect(7 - (j % 8), intdiv(j, 8), 1, 1);
        }
        else if (flipx === false && flipy === true) {
            ctx.fillRect((j % 8), 7 - intdiv(j, 8), 1, 1);
        }
        else if (flipx === true && flipy === true) {
            ctx.fillRect(7 - (j % 8), 7 - intdiv(j, 8), 1, 1);
        }
        else {
            ctx.fillRect((j % 8), intdiv(j, 8), 1, 1);
        }
    }
    return ctx.getImageData(0, 0, 8, 8);
}
function getObjImg(objNum, settings, tileset = 0) {
    const canvas = document.createElement("canvas");
    const width = getWidth(objNum, settings, tileset);
    const height = getHeight(objNum, settings, tileset);
    canvas.width = 16 * width;
    canvas.height = 16 * height;
    const ctx = canvas.getContext("2d");
    if (objNum === 0x22 || objNum === 0x23) {
        // Map 16 Direct Tile
    }
    else if (objNum === 0x12) {
        const type = ((settings >>> 0) & 0b1111);
        if (type === 1) {
            return steep_slope_2_image(objNum, settings, tileset, 0x1aa, 0x1e2, 0x3f);
        }
        else if (type === 0) {
            return normal_slope_2_image(objNum, settings, tileset, 0x196, 0x19B, 0x1DE, 0x1E6, 0x3F);
        }
        else if (type === 2) {
            return gradual_slope_2_image(objNum, settings, tileset, 0x16E, 0x173, 0x178, 0x17D, 0x1D8, 0x1DA, 0x1E6, 0x1E6, 0x3F);
        }
        else if (type == 3) {
            return normal_slope_image(objNum, settings, tileset, 0x1A0, 0x1A5, 0x1E6, 0x1E0, 0x3F);
        }
        else if (type === 4) {
            return steep_slope_image(objNum, settings, tileset, 0x1AF, 0x1E4, 0x3F);
        }
        else if (type === 5) {
            return gradual_slope_image(objNum, settings, tileset, 0x182, 0x187, 0x18C, 0x191, 0x1E6, 0x1E6, 0x1DB, 0x1DC, 0x3F);
        }
        else if (type === 6) {
            return rev_normal_slope_image(objNum, settings, tileset, 0x1EE, 0x1F0, 0x1c6, 0x1c7, 0x165);
        }
        else if (type === 8) {
            return rev_steep_slope_image(objNum, settings, tileset, 0x1EC, 0x1C4, 0x165);
        }
        else if (type === 9) {
            return rev_steep_slope_2_image(objNum, settings, tileset, 0x1ed, 0x1c5, 0x165);
        }
        else if (type === 7) {
            return rev_normal_slope_2_image(objNum, settings, tileset, 0x1F0, 0x1EF, 0x1C8, 0x1C9, 0x165);
        }
    }
    else if (objNum === 0x00 && settings == 0x47) {
        // Door
        return bone_like_image(objNum, settings, tileset, 0x1F, 0x20, 0x20);
    }
    else if (objNum === 0x00 && settings === 0x84) {
        // castle enterance
        return image(objNum, settings, tileset, [
            [0x73, 0x74, 0x75, 0x73, 0x74, 0x74, 0x7B, 0x79, 0x7A],
            [0x79, 0x7A, 0x7B, 0x79, 0x7A, 0x7B, 0x73, 0x74, 0x75],
            [0x73, 0x74, 0x74, 0x74, 0x75, 0x73, 0x77, 0x77, 0x78],
            [0x76, 0x77, 0x77, 0x7A, 0x7B, 0x79, 0x7A, 0x7A, 0x7B],
            [0x79, 0x7A, 0x7B, 0x73, 0x74, 0x74, 0x75, 0x73, 0x74],
            [0x73, 0x75, 0x73, 0x77, 0x7A, 0x7A, 0x7B, 0x79, 0x7A],
            [0x79, 0x7B, 0x79, 0x7B, 0x7C, 0x7D, 0x7D, 0x7D, 0x7D],
            [0x25, 0x73, 0x74, 0x75, 0x7E, 0x7F, 0x7F, 0x7F, 0x7F],
            [0x25, 0x76, 0x77, 0x78, 0x80, 0x81, 0x81, 0x81, 0x81],
            [0x25, 0x76, 0x77, 0x78, 0x82, 0x82, 0x82, 0x82, 0x7C],
            [0x25, 0x79, 0x7A, 0x7B, 0x83, 0x84, 0x84, 0x85, 0x80],
            [0x25, 0x73, 0x74, 0x75, 0x83, 0x84, 0x84, 0x85, 0x7C],
            [0x25, 0x76, 0x77, 0x78, 0x83, 0x84, 0x84, 0x85, 0x7E],
            [0x25, 0x79, 0x7A, 0x7B, 0x83, 0x84, 0x84, 0x85, 0x80],
        ]);
    }
    else if (objNum === 0x00 && settings === 0x80) {
        // ghost house entrance
        return image(objNum, settings, tileset, [
            [0xA4, 0xA6, 0xA9, 0xA9, 0xA9, 0xA9, 0xA9, 0xA9, 0xA9, 0xA9],
            [0xA4, 0xA5, 0xA5, 0xA5, 0xA5, 0xA5, 0xA5, 0xA5, 0xA5, 0xA5],
            [0xA4, 0xC0, 0xA8, 0xA8, 0xA8, 0xA8, 0xAB, 0xAB, 0xA8, 0xA8],
            [0xA4, 0xA6, 0xAC, 0xAD, 0xC0, 0xAC, 0xAD, 0xA6, 0xAC, 0xAD],
            [0xA4, 0xA6, 0xAE, 0xAF, 0xA6, 0xAE, 0xAF, 0xBF, 0xAE, 0xAF],
            [0xA4, 0xBF, 0xB0, 0xB1, 0xAB, 0xB0, 0xB1, 0xA6, 0xB0, 0xB1],
            [0xA4, 0xA6, 0xAB, 0xA8, 0xA9, 0xA8, 0xAB, 0xA9, 0xA8, 0xA8],
            [0xA4, 0xA5, 0xA5, 0xA5, 0xB5, 0xB6, 0xB7, 0xB8, 0xB9, 0xA5],
            [0xA4, 0xA7, 0xA8, 0xAB, 0xBA, 0xBB, 0xBC, 0xBD, 0xBE, 0xA8],
            [0xA4, 0xC0, 0xAC, 0xAD, 0xA6, 0xAC, 0xB2, 0xAD, 0xBF, 0xAC],
            [0xA4, 0xA7, 0xAE, 0xAF, 0xC0, 0xAE, 0xB3, 0xAF, 0xAB, 0xAE],
            [0xA4, 0xBF, 0xB0, 0xB1, 0xA6, 0xC1, 0xC2, 0xC3, 0xA6, 0xB0],
            [0xA4, 0xA5, 0xA5, 0xA5, 0xA5, 0xC1, 0xC2, 0xC3, 0xA5, 0xA5],
            [0xA4, 0xB4, 0xB4, 0xB4, 0xB4, 0xC1, 0xC2, 0xC3, 0xC5, 0xC5],
        ]);
    }
    else if (objNum === 0x00 && settings === 0x49) {
        // ghost house exit
        return image(objNum, settings, tileset, [
            [0xA5, 0xA5, 0xA4, 0xA5, 0xA5, 0xA4],
            [0xA7, 0xA8, 0xA4, 0xA7, 0xA8, 0xA4],
            [0xAC, 0xAD, 0xA4, 0xAC, 0xAD, 0xA4],
            [0xAE, 0xAF, 0xA4, 0xAE, 0xAF, 0xA4],
            [0xB0, 0xB1, 0xA4, 0xB0, 0xB1, 0xA4],
            [0xA7, 0xA8, 0xA4, 0xA7, 0xA8, 0xA4],
            [0xA5, 0xA5, 0xA5, 0xA5, 0xA5, 0xA4],
            [0xB4, 0xB4, 0xB4, 0xB4, 0xB4, 0xA4],
            [0xAC, 0xB2, 0xAD, 0xB4, 0xB4, 0xA4],
            [0xB0, 0xB3, 0xB1, 0xB4, 0xB4, 0xA4],
            [0xC1, 0xC2, 0xC3, 0xB4, 0xB4, 0xA4],
            [0xC1, 0xC2, 0xC3, 0xA5, 0xA5, 0xA4],
            [0xC1, 0xC2, 0xC3, 0xA7, 0xA8, 0xA4],
        ]);
    }
    else if (objNum === 0x00 && settings === 0x83) {
        // bush 2
        return image(objNum, settings, tileset, [
            [0x25, 0x25, 0x4B, 0x4C, 0x25, 0x25],
            [0x25, 0x54, 0x49, 0x5F, 0x63, 0x25],
            [0x25, 0x57, 0x49, 0x52, 0x4A, 0x5D],
            [0x5A, 0x49, 0x49, 0x49, 0x4F, 0x60],
        ]);
    }
    else if (objNum === 0x00 && settings === 0x82) {
        // bush 1
        return image(objNum, settings, tileset, [
            [0x25, 0x25, 0x25, 0x4b, 0x4d, 0x4e, 0x25, 0x25, 0x25],
            [0x25, 0x25, 0x54, 0x49, 0x49, 0x5f, 0x63, 0x25, 0x25],
            [0x25, 0x25, 0x57, 0x49, 0x49, 0x52, 0x4A, 0x5D, 0x25],
            [0x25, 0x5A, 0x49, 0x49, 0x50, 0x51, 0x4a, 0x60, 0x25],
            [0x5a, 0x49, 0x49, 0x49, 0x53, 0x4a, 0x4a, 0x4a, 0x63],
        ]);
    }
    else if (objNum === 0x00 && settings === 0x85) {
        // yoshi's house
        return image(objNum, settings, tileset, [
            [0x25, 0x25, 0x25, 0x25, 0x25, 0x25, 0x25, 0x25, 0x25, 0x25, 0x25, 0xCB, 0xCC, 0x25, 0x25, 0x25],
            [0x25, 0xCD, 0xCE, 0xCF, 0xCF, 0xCF, 0xCF, 0xCF, 0xCF, 0xCF, 0xCF, 0xCF, 0xCF, 0xD0, 0xD1, 0x25],
            [0x25, 0xD2, 0xD3, 0xD3, 0xD3, 0xD3, 0xD3, 0xD3, 0xD3, 0xD3, 0xD3, 0xD3, 0xD3, 0xD3, 0xD4, 0x25],
            [0x25, 0xD5, 0xD3, 0xD3, 0xD3, 0xD3, 0xD3, 0xD3, 0xD3, 0xD3, 0xD3, 0xD3, 0xD3, 0xD3, 0xD6, 0x25],
            [0x25, 0xD5, 0xD3, 0xD3, 0xD3, 0xD3, 0xD3, 0xD3, 0xD3, 0xD3, 0xD3, 0xD3, 0xD3, 0xD3, 0xD6, 0x25],
            [0x25, 0xD7, 0xD8, 0xD9, 0xD8, 0xD8, 0xD9, 0xD8, 0xD8, 0xD9, 0xD8, 0xDA, 0xDB, 0xD8, 0xDC, 0x25],
            [0x25, 0x25, 0x25, 0xDD, 0x25, 0x25, 0xDD, 0x25, 0x25, 0xDD, 0x25, 0xCB, 0xCC, 0x25, 0x25, 0x25],
            [0x25, 0x25, 0xDE, 0xDD, 0x25, 0x25, 0xDD, 0x25, 0x25, 0xDD, 0x25, 0xCB, 0xCC, 0x25, 0x25, 0x25],
            [0x25, 0xDF, 0xE0, 0xE1, 0x25, 0x25, 0xDD, 0x25, 0x25, 0xDD, 0x25, 0xE2, 0xE3, 0xE4, 0x25, 0x25],
            [0xE5, 0xE5, 0xE6, 0xDD, 0xE5, 0xE5, 0xDD, 0xE5, 0xE5, 0xDD, 0xE5, 0xE7, 0xE8, 0xE9, 0xE5, 0xE5],
        ]);
    }
    else if (objNum === 0x00 && settings == 0x81) {
        // weed
        return bone_like_image(objNum, settings, tileset, 0xC9, 0xCA, 0xCA);
    }
    else if (objNum === 0x00 && settings == 0x81) {
        // line guide end 1
        return grass_like_image(objNum, settings, tileset, 0x96, 0x97, 0x97);
    }
    else if (objNum === 0x00 && settings == 0x48) {
        // Blue Door
        return bone_like_image(objNum, settings, tileset, 0x27, 0x28, 0x28);
    }
    else if (objNum === 0x00 && settings == 0x44) {
        // Left slope triangle
        return bone_like_image(objNum, settings, tileset, 0x1b4, 0x1eb, 0x1eb);
    }
    else if (objNum === 0x00 && settings == 0x45) {
        // Right slope triangle
        return bone_like_image(objNum, settings, tileset, 0x1b5, 0x1eb, 0x1eb);
    }
    else if (objNum === 0x00 && settings == 0x91) {
        return bone_like_image(objNum, settings, tileset, 0x1aa, 0x1e2, 0x1e2);
    }
    else if (objNum === 0x00 && settings == 0x92) {
        return bone_like_image(objNum, settings, tileset, 0x1af, 0x1e4, 0x1e4);
    }
    else if (objNum === 0x00 && settings == 0x41) {
        // Dragon Coin
        return bone_like_image(objNum, settings, tileset, 0x2d, 0x2e, 0x2e);
    }
    else if (objNum === 0x0 && settings == 0x10) {
        // Small Door
        return single_block_image(objNum, settings, tileset, 0x1f);
    }
    else if (objNum === 0x0 && settings == 0x13) {
        // left dirt
        return single_block_image(objNum, settings, tileset, 0x42);
    }
    else if (objNum === 0x0 && settings == 0x14) {
        // right dirt
        return single_block_image(objNum, settings, tileset, 0x43);
    }
    else if (objNum === 0x0 && settings == 0x11) {
        // invisible 1-UP question block
        return single_block_image(objNum, settings, tileset, 0x22);
    }
    else if (objNum === 0x0 && settings == 0x28) {
        // TURN BLOCK WITH FLOWER
        return single_block_image(objNum, settings, tileset, 0x117);
    }
    else if (objNum === 0x0 && settings == 0x29) {
        // turn block with feather
        return single_block_image(objNum, settings, tileset, 0x118);
    }
    else if (objNum === 0x0 && settings == 0x2A) {
        // TURN BLOCK WITH star
        return single_block_image(objNum, settings, tileset, 0x119);
    }
    else if (objNum === 0x0 && settings == 0x2B) {
        // TURN BLOCK WITH vine
        return single_block_image(objNum, settings, tileset, 0x11a);
    }
    else if (objNum === 0x0 && settings == 0x2C) {
        // TURN BLOCK WITH MULTIPLE COINS
        return single_block_image(objNum, settings, tileset, 0x11b);
    }
    else if (objNum === 0x0 && settings == 0x2D) {
        // TURN BLOCK WITH coin
        return single_block_image(objNum, settings, tileset, 0x11c);
    }
    else if (objNum === 0x0 && settings == 0x2E) {
        // TURN BLOCK WITH NOTHING
        return single_block_image(objNum, settings, tileset, 0x129);
    }
    else if (objNum === 0x0 && settings == 0x2F) {
        // TURN BLOCK WITH POW
        return single_block_image(objNum, settings, tileset, 0x11d);
    }
    else if (objNum === 0x0 && settings == 0x12) {
        // invisible note block
        return single_block_image(objNum, settings, tileset, 0x23);
    }
    else if (objNum === 0x0 && settings == 0x19) {
        // invisible 1up point 1
        return single_block_image(objNum, settings, tileset, 0x6f);
    }
    else if (objNum === 0x0 && settings == 0x1A) {
        // invisible 1up point 2
        return single_block_image(objNum, settings, tileset, 0x70);
    }
    else if (objNum === 0x0 && settings == 0x1B) {
        // invisible 1up point 3
        return single_block_image(objNum, settings, tileset, 0x71);
    }
    else if (objNum === 0x0 && settings == 0x1C) {
        // invisible 1up point 4
        return single_block_image(objNum, settings, tileset, 0x72);
    }
    else if (objNum === 0x0 && settings == 0x15) {
        // invisible small door
        return single_block_image(objNum, settings, tileset, 0x27);
    }
    else if (objNum === 0x0 && settings == 0x87) {
        // green ! block
        return single_block_image(objNum, settings, tileset, 0x16a);
    }
    else if (objNum === 0x0 && settings == 0x40) {
        // glass block
        return single_block_image(objNum, settings, tileset, 0x12c);
    }
    else if (objNum === 0x0 && settings == 0x20) {
        // always turn block
        return single_block_image(objNum, settings, tileset, 0x48);
    }
    else if (objNum === 0x0 && (settings == 0x21 || settings == 0x22)) {
        if (settings === 0x21) {
            return single_block_image(objNum, settings, tileset, 0x36);
        }
        else {
            return single_block_image(objNum, settings, tileset, 0x37);
        }
    }
    else if (objNum === 0x0 && settings == 0x23) {
        // note block with item
        return single_block_image(objNum, settings, tileset, 0x111);
    }
    else if (objNum === 0x0 && settings == 0x24) {
        // on / off block
        return single_block_image(objNum, settings, tileset, 0x112);
    }
    else if (objNum === 0x0 && settings == 0x25) {
        // directional coins block
        return single_block_image(objNum, settings, tileset, 0x114);
    }
    else if (objNum === 0x0 && settings == 0x26) {
        // another note block
        return single_block_image(objNum, settings, tileset, 0x115);
    }
    else if (objNum === 0x0 && settings == 0x27) {
        // note block with always jumping
        return single_block_image(objNum, settings, tileset, 0x116);
    }
    else if (objNum === 0x0 && settings == 0x1D) {
        // Red Berry
        return single_block_image(objNum, settings, tileset, 0x45);
    }
    else if (objNum === 0x0 && settings == 0x1E) {
        // Peach Berry
        return single_block_image(objNum, settings, tileset, 0x46);
    }
    else if (objNum === 0x0 && settings == 0x1F) {
        // Green Berry
        return single_block_image(objNum, settings, tileset, 0x47);
    }
    else if (objNum === 0x0 && settings == 0x18) {
        // Moon
        return single_block_image(objNum, settings, tileset, 0x6e);
    }
    else if (objNum === 0x0 && settings == 0x68) {
        return single_block_image(objNum, settings, tileset, 0x91);
    }
    else if (objNum === 0x0 && settings == 0x69) {
        return single_block_image(objNum, settings, tileset, 0x92);
    }
    else if (objNum === 0x0 && settings == 0x6A) {
        return single_block_image(objNum, settings, tileset, 0x96);
    }
    else if (objNum === 0x0 && settings == 0x6B) {
        return single_block_image(objNum, settings, tileset, 0x97);
    }
    else if (objNum === 0x0 && settings == 0x6C) {
        return single_block_image(objNum, settings, tileset, 0x9a);
    }
    else if (objNum === 0x0 && settings == 0x6D) {
        return single_block_image(objNum, settings, tileset, 0x9b);
    }
    else if (objNum === 0x0 && settings == 0x6E) {
        return single_block_image(objNum, settings, tileset, 0x9f);
    }
    else if (objNum === 0x0 && settings == 0x6F) {
        return single_block_image(objNum, settings, tileset, 0xa0);
    }
    else if (objNum === 0x0 && settings == 0x5b) {
        return single_block_image(objNum, settings, tileset, 0x93);
    }
    else if (objNum === 0x0 && settings == 0x5c) {
        return single_block_image(objNum, settings, tileset, 0x94);
    }
    else if (objNum === 0x0 && settings == 0x5d) {
        return single_block_image(objNum, settings, tileset, 0x95);
    }
    else if (objNum === 0x0 && settings == 0x5e) {
        return single_block_image(objNum, settings, tileset, 0x96);
    }
    else if (objNum === 0x0 && settings == 0x51) {
        return single_block_image(objNum, settings, tileset, 0x76);
    }
    else if (objNum === 0x0 && settings == 0x52) {
        return single_block_image(objNum, settings, tileset, 0x77);
    }
    else if (objNum === 0x0 && settings == 0x53) {
        return single_block_image(objNum, settings, tileset, 0x78);
    }
    else if (objNum === 0x0 && settings == 0x54) {
        return single_block_image(objNum, settings, tileset, 0x79);
    }
    else if (objNum === 0x0 && settings == 0x88) {
        return single_block_image(objNum, settings, tileset, 0xc1);
    }
    else if (objNum === 0x0 && settings == 0x89) {
        return single_block_image(objNum, settings, tileset, 0xc2);
    }
    else if (objNum === 0x0 && settings == 0x60) {
        return single_block_image(objNum, settings, tileset, 0x1fe);
    }
    else if (objNum === 0x0 && settings == 0x4B) {
        return single_block_image(objNum, settings, tileset, 0x107);
    }
    else if (objNum === 0x0 && settings == 0x4C) {
        return single_block_image(objNum, settings, tileset, 0x108);
    }
    else if (objNum === 0x0 && settings == 0x57) {
        // switch palace tile
        return single_block_image(objNum, settings, tileset, 0x73);
    }
    else if (objNum === 0x0 && settings == 0x58) {
        // switch palace tile
        return single_block_image(objNum, settings, tileset, 0x74);
    }
    else if (objNum === 0x0 && settings == 0x59) {
        // switch palace tile
        return single_block_image(objNum, settings, tileset, 0x75);
    }
    else if (objNum === 0x0 && settings == 0x5A) {
        // switch palace tile
        return single_block_image(objNum, settings, tileset, 0x76);
    }
    else if (objNum === 0x0 && settings == 0x97) {
        // switch palace tile
        return single_block_image(objNum, settings, tileset, 0x110);
    }
    else if (objNum === 0x0 && settings == 0x2D) {
        // COIN BLOCK
        return single_block_image(objNum, settings, tileset, 0x11c);
    }
    else if (objNum === 0xD) {
        // Cement Block
        return single_block_image(objNum, settings, tileset, 0x130);
    }
    else if (objNum === 0x1) {
        // Water
        return single_block_image(objNum, settings, tileset, 0x2);
    }
    else if (objNum === 0x2) {
        // Invisible coin blocks
        return single_block_image(objNum, settings, tileset, 0x21);
    }
    else if (objNum === 0x3) {
        // Invisible note blocks
        return single_block_image(objNum, settings, tileset, 0x23);
    }
    else if (objNum === 0x4) {
        // Invisible POW coins
        return single_block_image(objNum, settings, tileset, 0x29);
    }
    else if (objNum === 0x5) {
        // Coin
        return single_block_image(objNum, settings, tileset, 0x2b);
    }
    else if (objNum === 0x6) {
        // Dirt
        return single_block_image(objNum, settings, tileset, 0x44);
    }
    else if (objNum === 0x7) {
        // underground water
        return single_block_image(objNum, settings, tileset, 0x3);
    }
    else if (objNum === 0x8) {
        // note blocks
        return single_block_image(objNum, settings, tileset, 0x113);
    }
    else if (objNum === 0xB) {
        // blue blocks
        return single_block_image(objNum, settings, tileset, 0x12e);
    }
    else if (objNum === 0xC) {
        // plant block
        return single_block_image(objNum, settings, tileset, 0x12f);
    }
    else if (objNum === 0xE) {
        // brown block
        return single_block_image(objNum, settings, tileset, 0x132);
    }
    else if (objNum === 0x16) {
        // purple coins
        return single_block_image(objNum, settings, tileset, 0x2c);
    }
    else if (objNum === 0xA) {
        // COIN ? BLOCK
        return single_block_image(objNum, settings, tileset, 0x124);
    }
    else if (objNum === 0x9) {
        // Turn Block
        return single_block_image(objNum, settings, tileset, 0x11e);
    }
    else if (objNum === 0x17) {
        // Cloud or Rope
        if ((settings & 0b11110000) === 0) {
            return single_block_image(objNum, settings, tileset, 0x105);
        }
        else {
            return single_block_image(objNum, settings, tileset, 0x106);
        }
    }
    else if (objNum === 0x00 && settings === 0x16) {
        return single_block_image(objNum, settings, tileset, 0x29);
    }
    else if (objNum === 0x00 && settings === 0x55) {
        // line guide end 1
        return bone_like_image(objNum, settings, tileset, 0x96, 0x97, 0x97);
    }
    else if (objNum === 0x00 && settings === 0x56) {
        // line guide end 2
        return grass_like_image(objNum, settings, tileset, 0x98, 0x99, 0x99);
    }
    else if (objNum === 0x1C) {
        // Bridge
        return bridge_like_image(objNum, settings, tileset, 0x26, 0x144);
    }
    else if (objNum === 0x00 && settings === 0x2B) {
        // 1UP turn block
        return single_block_image(objNum, settings, tileset, 0x11a);
    }
    else if (objNum === 0x00 && settings === 0x8E) {
        // Yellow ! block
        return single_block_image(objNum, settings, tileset, 0x16b);
    }
    else if (objNum === 0x00 && settings === 0x17) {
        // Bouns star block
        return single_block_image(objNum, settings, tileset, 0x12d);
    }
    else if (objNum === 0x00 && settings === 0x36) {
        // Yoshi ? block
        return single_block_image(objNum, settings, tileset, 0x126);
    }
    else if (objNum === 0x00 && settings === 0x30) {
        // flower question block
        return single_block_image(objNum, settings, tileset, 0x11f);
    }
    else if (objNum === 0x00 && settings === 0x31) {
        // feather question block
        return single_block_image(objNum, settings, tileset, 0x120);
    }
    else if (objNum === 0x00 && settings === 0x32) {
        // star question block
        return single_block_image(objNum, settings, tileset, 0x121);
    }
    else if (objNum === 0x00 && settings === 0x33) {
        // star 2 question block
        return single_block_image(objNum, settings, tileset, 0x122);
    }
    else if (objNum === 0x00 && settings === 0x34) {
        // multiple coins question block
        return single_block_image(objNum, settings, tileset, 0x123);
    }
    else if (objNum === 0x00 && settings === 0x35) {
        // key / wings question block
        return single_block_image(objNum, settings, tileset, 0x125);
    }
    else if (objNum === 0x00 && settings === 0x37) {
        // turtle ? block
        return single_block_image(objNum, settings, tileset, 0x127);
    }
    else if (objNum === 0x00 && settings === 0x38) {
        // turtle ? block 2
        return single_block_image(objNum, settings, tileset, 0x128);
    }
    else if (objNum === 0x00 && settings === 0x39) {
        // mario 3 style block with feather
        return single_block_image(objNum, settings, tileset, 0x12a);
    }
    else if (objNum === 0x00 && settings === 0x3A) {
        return single_block_image(objNum, settings, tileset, 0x1de);
    }
    else if (objNum === 0x00 && settings === 0x3B) {
        return single_block_image(objNum, settings, tileset, 0x1e0);
    }
    else if (objNum === 0x00 && settings === 0x3C) {
        return single_block_image(objNum, settings, tileset, 0x1e2);
    }
    else if (objNum === 0x00 && settings === 0x3D) {
        return single_block_image(objNum, settings, tileset, 0x1e4);
    }
    else if (objNum === 0x00 && settings === 0x3E) {
        return single_block_image(objNum, settings, tileset, 0x1ec);
    }
    else if (objNum === 0x00 && settings === 0x3F) {
        return single_block_image(objNum, settings, tileset, 0x1ed);
    }
    else if (objNum === 0x00 && settings === 0x70) {
        // bit of canvas
        return grass_like_image(objNum, settings, tileset, 0x84, 0x85, 0x85);
    }
    else if (objNum === 0x00 && settings === 0x71) {
        // canvas 1
        return canvas_image(objNum, settings, tileset);
    }
    else if (objNum === 0x00 && settings === 0x73) {
        // canvas 3
        return canvas3_image(objNum, settings, tileset);
    }
    else if (objNum === 0x00 && settings === 0x72) {
        // canvas 2
        return canvas2_image(objNum, settings, tileset);
    }
    else if (objNum === 0x00 && settings === 0x74) {
        return canvas4_image(objNum, settings, tileset);
    }
    else if (objNum === 0x00 && settings === 0x75) {
        // canvas tile 1
        return single_block_image(objNum, settings, tileset, 0x7D);
    }
    else if (objNum === 0x00 && settings === 0x76) {
        // canvas tile 2
        return single_block_image(objNum, settings, tileset, 0x7E);
    }
    else if (objNum === 0x00 && settings === 0x77) {
        // canvas tile 3
        return single_block_image(objNum, settings, tileset, 0x7F);
    }
    else if (objNum === 0x00 && settings === 0x78) {
        // canvas tile 4
        return single_block_image(objNum, settings, tileset, 0x80);
    }
    else if (objNum === 0x00 && settings === 0x79) {
        // canvas tile 5
        return single_block_image(objNum, settings, tileset, 0x81);
    }
    else if (objNum === 0x00 && settings === 0x7A) {
        // canvas tile 6
        return single_block_image(objNum, settings, tileset, 0x82);
    }
    else if (objNum === 0x00 && settings === 0x7B) {
        // canvas tile 7
        return single_block_image(objNum, settings, tileset, 0x83);
    }
    else if (objNum === 0x00 && settings === 0x7c) {
        // bit of canvas 2
        return bone_like_image(objNum, settings, tileset, 0x81, 0x84, 0x84);
    }
    else if (objNum === 0x00 && settings === 0x7d) {
        // bit of canvas 3
        return bone_like_image(objNum, settings, tileset, 0x82, 0x85, 0x85);
    }
    else if (objNum === 0x00 && settings === 0x7e) {
        // bit of canvas 4
        return bone_like_image(objNum, settings, tileset, 0x83, 0x86, 0x86);
    }
    else if (objNum === 0x00 && settings === 0x86) {
        // goal sign
        return stone_like_image(objNum, settings, tileset, 0x66, 0x67, 0x67, 0x68, 0x69, 0x69, 0x68, 0x69, 0x69);
    }
    else if (objNum === 0x00 && settings === 0x61) {
        // ghost house clock
        return stone_like_image(objNum, settings, tileset, 0x97, 0x98, 0x99, 0x9a, 0x9b, 0x9c, 0x9d, 0x9e, 0x9f);
    }
    else if (objNum === 0x00 && settings === 0x4A) {
        // touch net
        return stone_like_image(objNum, settings, tileset, 0x10, 0x11, 0x12, 0x13, 0x0b, 0x15, 0x16, 0x17, 0x18);
    }
    else if (objNum === 0x00 && settings === 0x66) {
        let topleft = getMap16TileImg(0x25);
        let topcenterleft = getMap16TileImg(0x25);
        let topcenterright = getMap16TileImg(0x7A);
        let topright = getMap16TileImg(0x7B);
        let midtopleft = getMap16TileImg(0x25);
        let midtopcenterleft = getMap16TileImg(0x7C);
        let midtopcenterright = getMap16TileImg(0x7D);
        let midtopright = getMap16TileImg(0x25);
        let midbtmleft = getMap16TileImg(0x7C);
        let midbtmcenterleft = getMap16TileImg(0x7D);
        let midbtmcenterright = getMap16TileImg(0x25);
        let midbtmright = getMap16TileImg(0x25);
        let bottomleft = getMap16TileImg(0x7D);
        let bottomcenterleft = getMap16TileImg(0x25);
        let bottomcenterright = getMap16TileImg(0x25);
        let bottomright = getMap16TileImg(0x25);
        canvas.width = 16 * 4;
        canvas.height = 16 * 4;
        const ctx = canvas.getContext("2d");
        ctx.putImageData(topleft, 0, 0);
        ctx.putImageData(topcenterleft, 16, 0);
        ctx.putImageData(topcenterright, 32, 0);
        ctx.putImageData(topright, 48, 0);
        ctx.putImageData(midtopleft, 0, 16);
        ctx.putImageData(midtopcenterleft, 16, 16);
        ctx.putImageData(midtopcenterright, 32, 16);
        ctx.putImageData(midtopright, 48, 16);
        ctx.putImageData(midbtmleft, 0, 32);
        ctx.putImageData(midbtmcenterleft, 16, 32);
        ctx.putImageData(midbtmcenterright, 32, 32);
        ctx.putImageData(midbtmright, 48, 32);
        ctx.putImageData(bottomleft, 0, 48);
        ctx.putImageData(bottomcenterleft, 16, 48);
        ctx.putImageData(bottomcenterright, 32, 48);
        ctx.putImageData(bottomright, 48, 48);
        return canvas.toDataURL('image/png');
    }
    else if (objNum === 0x00 && settings === 0x67) {
        let topleft = getMap16TileImg(0x7E);
        let topcenterleft = getMap16TileImg(0x7F);
        let topcenterright = getMap16TileImg(0x25);
        let topright = getMap16TileImg(0x25);
        let midtopleft = getMap16TileImg(0x25);
        let midtopcenterleft = getMap16TileImg(0x7E);
        let midtopcenterright = getMap16TileImg(0x7F);
        let midtopright = getMap16TileImg(0x25);
        let midbtmleft = getMap16TileImg(0x25);
        let midbtmcenterleft = getMap16TileImg(0x25);
        let midbtmcenterright = getMap16TileImg(0x7E);
        let midbtmright = getMap16TileImg(0x7F);
        let bottomleft = getMap16TileImg(0x25);
        let bottomcenterleft = getMap16TileImg(0x25);
        let bottomcenterright = getMap16TileImg(0x25);
        let bottomright = getMap16TileImg(0x7E);
        canvas.width = 16 * 4;
        canvas.height = 16 * 4;
        const ctx = canvas.getContext("2d");
        ctx.putImageData(topleft, 0, 0);
        ctx.putImageData(topcenterleft, 16, 0);
        ctx.putImageData(topcenterright, 32, 0);
        ctx.putImageData(topright, 48, 0);
        ctx.putImageData(midtopleft, 0, 16);
        ctx.putImageData(midtopcenterleft, 16, 16);
        ctx.putImageData(midtopcenterright, 32, 16);
        ctx.putImageData(midtopright, 48, 16);
        ctx.putImageData(midbtmleft, 0, 32);
        ctx.putImageData(midbtmcenterleft, 16, 32);
        ctx.putImageData(midbtmcenterright, 32, 32);
        ctx.putImageData(midbtmright, 48, 32);
        ctx.putImageData(bottomleft, 0, 48);
        ctx.putImageData(bottomcenterleft, 16, 48);
        ctx.putImageData(bottomcenterright, 32, 48);
        ctx.putImageData(bottomright, 48, 48);
        return canvas.toDataURL('image/png');
    }
    else if (objNum === 0x00 && settings === 0x62) {
        return stone_like_image(objNum, settings, tileset, 0x86, 0x87, 0x25, 0x25, 0x86, 0x87, 0x25, 0x25, 0x86);
    }
    else if (objNum === 0x00 && settings === 0x63) {
        return stone_like_image(objNum, settings, tileset, 0x25, 0x84, 0x85, 0x84, 0x85, 0x25, 0x85, 0x25, 0x25);
    }
    else if (objNum === 0x00 && settings === 0x90) {
        // boss door
        return stone_like_image(objNum, settings, tileset, 0x98, 0x99, 0x99, 0x9a, 0x9b, 0x9b, 0x9c, 0x9c, 0x9c);
    }
    else if (objNum === 0x00 && settings === 0x4d) {
        return stone_like_image(objNum, settings, tileset, 0x7a, 0x25, 0x7b, 0x25, 0x25, 0x25, 0x7c, 0x25, 0x25);
    }
    else if (objNum === 0x00 && settings === 0x4e) {
        return stone_like_image(objNum, settings, tileset, 0x7e, 0x25, 0x7f, 0x25, 0x25, 0x25, 0x25, 0x25, 0x7d);
    }
    else if (objNum === 0x00 && settings === 0x4f) {
        return stone_like_image(objNum, settings, tileset, 0x82, 0x25, 0x25, 0x25, 0x25, 0x25, 0x80, 0x25, 0x81);
    }
    else if (objNum === 0x00 && settings === 0x50) {
        return stone_like_image(objNum, settings, tileset, 0x25, 0x25, 0x83, 0x25, 0x25, 0x25, 0x84, 0x25, 0x85);
    }
    else if (objNum === 0x00 && settings === 0x64) {
        // cobweb 1
        return stone_like_image(objNum, settings, tileset, 0x8c, 0x25, 0x8d, 0x25, 0x25, 0x25, 0x25, 0x25, 0x8e);
    }
    else if (objNum === 0x00 && settings === 0x65) {
        // cobweb 2
        return stone_like_image(objNum, settings, tileset, 0x90, 0x25, 0x91, 0x25, 0x25, 0x25, 0x8f, 0x25, 0x25);
    }
    else if (objNum === 0x00 && settings === 0x8F) {
        // ghost house window
        return stone_like_image(objNum, settings, tileset, 0xfc, 0x25, 0xfd, 0x25, 0x25, 0x25, 0xfe, 0x25, 0xff);
    }
    else if (objNum === 0x00 && settings === 0x7f) {
        return stone_like_image(objNum, settings, tileset, 0x166, 0x25, 0x167, 0x25, 0x25, 0x25, 0x168, 0x25, 0x169);
    }
    else if (objNum === 0x00 && settings === 0x8A) {
        // green switch
        return stone_like_image(objNum, settings, tileset, 0xec, 0x25, 0xed, 0x25, 0x25, 0x25, 0xee, 0x25, 0xef);
    }
    else if (objNum === 0x00 && settings === 0x8B) {
        // yellow switch
        return stone_like_image(objNum, settings, tileset, 0xf0, 0x25, 0xf1, 0x25, 0x25, 0x25, 0xf2, 0x25, 0xf3);
    }
    else if (objNum === 0x00 && settings === 0x8C) {
        // blue switch
        return stone_like_image(objNum, settings, tileset, 0xf4, 0x25, 0xf5, 0x25, 0x25, 0x25, 0xf6, 0x25, 0xf7);
    }
    else if (objNum === 0x00 && settings === 0x8D) {
        // red switch
        return stone_like_image(objNum, settings, tileset, 0xf8, 0x25, 0xf9, 0x25, 0x25, 0x25, 0xfa, 0x25, 0xfb);
    }
    else if (objNum === 0x00 && settings === 0x93) {
        return stone_like_image(objNum, settings, tileset, 0x196, 0x25, 0x19b, 0x25, 0x25, 0x25, 0x1de, 0x25, 0x1e6);
    }
    else if (objNum === 0x00 && settings === 0x94) {
        return stone_like_image(objNum, settings, tileset, 0x1a0, 0x25, 0x1a5, 0x25, 0x25, 0x25, 0x1e6, 0x25, 0x1e0);
    }
    else if (objNum === 0x15) {
        // goal or midway
        if ((settings & 0b00001111) === 0) {
            // midway
            return stone_like_image(objNum, settings, tileset, 0x2f, 0x25, 0x32, 0x30, 0x25, 0x33, 0x31, 0x25, 0x34);
        }
        else {
            // goal
            return stone_like_image(objNum, settings, tileset, 0x39, 0x25, 0x3c, 0x3a, 0x25, 0x3d, 0x3b, 0x25, 0x3e);
        }
    }
    else if (objNum === 0x00 && settings === 0x46) {
        // midway
        return grass_like_image(objNum, settings, tileset, 0x35, 0x38, 0x38);
    }
    else if (objNum === 0x00 && settings === 0x42) {
        // slope 1
        return grass_like_image(objNum, settings, tileset, 0x1D8, 0x1DA, 0x1DA);
    }
    else if (objNum === 0x00 && settings === 0x43) {
        // slope 2
        return grass_like_image(objNum, settings, tileset, 0x1DB, 0x1DC, 0x1DC);
    }
    else if (objNum === 0x21) {
        // long ground
        return bone_like_image(objNum, settings, tileset, 0x100, 0x3f, 0x3f);
    }
    else if (objNum === 0x14) {
        // ground
        return bone_like_image(objNum, settings, tileset, 0x100, 0x3f, 0x3f);
    }
    else if (objNum === 0x18) {
        // water
        return bone_like_image(objNum, settings, tileset, 0x0, 0x2, 0x2);
    }
    else if (objNum === 0x19) {
        // underground water
        return bone_like_image(objNum, settings, tileset, 0x1, 0x3, 0x3);
    }
    else if (objNum === 0x1A) {
        // lava
        return bone_like_image(objNum, settings, tileset, 0x4, 0x5, 0x5);
    }
    else if (objNum === 0x1B) {
        // Net
        return bone_like_image(objNum, settings, tileset, 0x8, 0xb, 0xb);
    }
    else if (objNum === 0x1D) {
        // bottom Net
        return bone_like_image(objNum, settings, tileset, 0xb, 0xb, 0xe);
    }
    else if (objNum === 0x20) {
        return grass_like_image(objNum, settings, tileset, 0x156, 0x157, 0x158);
    }
    else if (objNum === 0x13) {
        // edges
        const type = settings & 0b1111;
        const width = 1;
        const height = getHeight(objNum, settings, tileset);
        canvas.width = width * 16;
        canvas.height = height * 16;
        const ctx = canvas.getContext("2d");
        if (type === 0 || type === 1 || type === 2 || type === 4 || type === 6) {
            let mid;
            if (type === 0) {
                mid = (0x40);
            }
            else if (type === 1) {
                mid = (0x41);
            }
            else if (type === 2) {
                mid = (0x6);
            }
            else if (type === 4) {
                mid = (0x14B);
            }
            else if (type === 6) {
                mid = (0x14C);
            }
            return single_block_image(objNum, settings, tileset, mid);
        }
        else if (type === 8 || type === 7 || type === 3 || type === 5 || type === 9 || type === 10) {
            // right ground
            const width = 1;
            const height = getHeight(objNum, settings, tileset);
            let top;
            let mid;
            if (type === 8) {
                top = (0x103);
                mid = (0x41);
            }
            else if (type === 7) {
                top = (0x101);
                mid = (0x40);
            }
            else if (type === 3) {
                top = (0x145);
                mid = (0x14B);
            }
            else if (type === 5) {
                top = (0x148);
                mid = (0x14C);
            }
            else if (type === 9) {
                top = (0x1B6);
                mid = (0x14B);
            }
            else if (type === 10) {
                top = (0x1B7);
                mid = (0x14C);
            }
            return bone_like_image(objNum, settings, tileset, top, mid, mid);
        }
        else if (type === 13 || type === 11 || type === 14 || type === 12) {
            const width = 1;
            const height = getHeight(objNum, settings, tileset);
            let top;
            let mid;
            let btm;
            if (type === 11 || type === 12) {
                top = (0x145);
                mid = (0x14B);
                btm = (0x1E2);
            }
            else if (type === 13 || type === 14) {
                top = (0x148);
                mid = (0x14C);
                btm = (0x1E4);
            }
            if (type === 12) {
                top = (0x14B);
            }
            else if (type === 14) {
                top = (0x14C);
            }
            return bone_like_image(objNum, settings, tileset, top, mid, btm);
        }
    }
    else if (objNum === 0xF) {
        // pipe
        const type = settings & 0b1111;
        const width = 2;
        const height = getHeight(objNum, settings, tileset);
        let topleft;
        let topright;
        let midleft;
        let midright;
        let btmleft;
        let btmright;
        topleft = getMap16TileImg(0x133);
        topright = getMap16TileImg(0x134);
        midleft = getMap16TileImg(0x135);
        midright = getMap16TileImg(0x136);
        btmleft = getMap16TileImg(0x133);
        btmright = getMap16TileImg(0x134);
        canvas.width = width * 16;
        canvas.height = height * 16;
        const ctx = canvas.getContext("2d");
        for (let j = 0; j < height; j++) {
            ctx.putImageData(midleft, 0, j * 16);
            ctx.putImageData(midright, 16, j * 16);
        }
        if (type === 1) {
            topleft = getMap16TileImg(0x137);
            topright = getMap16TileImg(0x138);
        }
        else if (type === 2) {
            topleft = getMap16TileImg(0x139);
            topright = getMap16TileImg(0x13A);
            btmleft = getMap16TileImg(0x139);
            btmright = getMap16TileImg(0x13A);
        }
        else if (type === 4) {
            btmleft = getMap16TileImg(0x137);
            btmright = getMap16TileImg(0x138);
        }
        if (type === 0 || type === 1) {
            ctx.putImageData(topleft, 0, 0);
            ctx.putImageData(topright, 16, 0);
        }
        else if (type === 2) {
            ctx.putImageData(topleft, 0, 0);
            ctx.putImageData(topright, 16, 0);
            ctx.putImageData(btmleft, 0, (height - 1) * 16);
            ctx.putImageData(btmright, 16, (height - 1) * 16);
        }
        else if (type === 3 || type === 4) {
            ctx.putImageData(btmleft, 0, (height - 1) * 16);
            ctx.putImageData(btmright, 16, (height - 1) * 16);
        }
        return canvas.toDataURL('image/png');
    }
    else if (objNum === 0x10) {
        // hor pipe
        const type = ((settings >>> 4) & 0b1111);
        let lefttop;
        let leftbtm;
        let midtop;
        let midbtm;
        let righttop;
        let rightbtm;
        lefttop = (0x13B);
        leftbtm = (0x13C);
        midtop = (0x13D);
        midbtm = (0x13E);
        righttop = (0x13B);
        rightbtm = (0x13C);
        if (type === 1 || type === 3) {
            rightbtm = (0x138);
        }
        if (type === 0 || type === 1) {
            return stone_like_image(objNum, settings, tileset, lefttop, midtop, midtop, 0x25, 0x25, 0x25, leftbtm, midbtm, midbtm);
        }
        else if (type === 2 || type === 3) {
            return stone_like_image(objNum, settings, tileset, midtop, midtop, righttop, 0x25, 0x25, 0x25, midbtm, midbtm, rightbtm);
        }
    }
    else if (objNum === 0x1F) {
        // small pipe
        return bone_like_image(objNum, settings, tileset, 0x153, 0x154, 0x155);
    }
    else if (objNum === 0x00 && settings === 0x95) {
        return bone_like_image(objNum, settings, tileset, 0x1CA, 0x1CB, 0x1F1);
    }
    else if (objNum === 0x00 && settings === 0x96) {
        return bone_like_image(objNum, settings, tileset, 0x1CC, 0x1CD, 0x1F2);
    }
    else if (objNum === 0x11) {
        // bullet bill shooter
        const width = 1;
        const height = getHeight(objNum, settings, tileset);
        let top = getMap16TileImg(0x141);
        let mid = getMap16TileImg(0x142);
        let btm = getMap16TileImg(0x143);
        canvas.width = width * 16;
        canvas.height = height * 16;
        const ctx = canvas.getContext("2d");
        ctx.putImageData(top, 0, 0);
        ctx.putImageData(mid, 0, 16);
        for (let j = 2; j < height; j++) {
            ctx.putImageData(btm, 0, j * 16);
        }
        return canvas.toDataURL('image/png');
    }
    else if (objNum === 0x1E) {
        // net left / right
        const type = settings & 0b1111;
        if (type === 0) {
            return single_block_image(objNum, settings, tileset, 0xa);
        }
        else {
            return single_block_image(objNum, settings, tileset, 0xc);
        }
    }
    else if (objNum >= 0x2E || objNum <= 0x3F) {
        if (tileset === 0) {
            // plain
            if (objNum === 0x3F && ((settings >>> 4) & 0b1111) === 0) {
                // grass
                return grass_like_image(objNum, settings, tileset, 0x73, 0x74, 0x79);
            }
            else if (objNum === 0x33) {
                return forest_tree_top_image(objNum, settings, tileset);
            }
            else if (objNum === 0x3F && ((settings >>> 4) & 0b1111) === 1) {
                // grass 2
                return grass_like_image(objNum, settings, tileset, 0x7A, 0x7B, 0x80);
            }
            else if (objNum === 0x3F && ((settings >>> 4) & 0b1111) === 2) {
                // grass 3
                return grass_like_image(objNum, settings, tileset, 0x85, 0x86, 0x87);
            }
            else if (objNum === 0x3F && ((settings >>> 4) & 0b1111) === 3) {
                // grass 4
                return grass_like_image(objNum, settings, tileset, 0x88, 0x89, 0x8e);
            }
            else if (objNum === 0x3F && ((settings >>> 4) & 0b1111) === 4) {
                // grass 5
                return grass_like_image(objNum, settings, tileset, 0xc3, 0xc3, 0xc3);
            }
            else if (objNum === 0x32) {
                return single_block_image(objNum, settings, tileset, 0x16C);
            }
            else if (objNum === 0x38) {
                return single_block_image(objNum, settings, tileset, 0x16D);
            }
            else if (objNum === 0x31) {
                return single_block_image(objNum, settings, tileset, 0x165);
            }
            else if (objNum === 0x30) {
                return pipe_like_image(objNum, settings, tileset, 0x161, 0x162, 0x163, 0x164);
            }
            else if (objNum === 0x34) {
                const mode = ((settings >>> 0) & 0b1111);
                if (mode === 0) {
                    return bone_like_image(objNum, settings, tileset, 0x15F, 0x160, 0x160);
                }
                else if (mode === 1) {
                    return bone_like_image(objNum, settings, tileset, 0x15E, 0x15D, 0x15D);
                }
                else if (mode === 2) {
                    return bone_like_image(objNum, settings, tileset, 0x110, 0xC5, 0xC5);
                }
                else if (mode === 3) {
                    return bone_like_image(objNum, settings, tileset, 0x10F, 0xC4, 0xC4);
                }
            }
            else if (objNum === 0x35) {
                return bone_like_image(objNum, settings, tileset, 0x10E, 0xB8, 0xB8);
            }
            else if (objNum === 0x3C) {
                const pilTop = getMap16TileImg(0x108);
                const pilTopLeft = getMap16TileImg(0x107);
                const pilTopRight = getMap16TileImg(0x109);
                const top = getMap16TileImg(0x10A);
                const pil = getMap16TileImg(0x81);
                const archLeft = getMap16TileImg(0x82);
                const archRight = getMap16TileImg(0x83);
                const emptyTile = getMap16TileImg(0x25);
                const archRightUnder = getMap16TileImg(0x84);
                for (let i = 0; i < width; i++) {
                    if (i % 3 === 0) {
                        ctx.putImageData(pilTop, i * 16, 0);
                        ctx.putImageData(pil, i * 16, 16);
                        ctx.putImageData(pil, i * 16, 32);
                        ctx.putImageData(pil, i * 16, 48);
                    }
                    else if (i % 3 === 1) {
                        ctx.putImageData(top, i * 16, 0);
                        ctx.putImageData(archLeft, i * 16, 16);
                        ctx.putImageData(emptyTile, i * 16, 32);
                        ctx.putImageData(emptyTile, i * 16, 48);
                    }
                    else {
                        ctx.putImageData(top, i * 16, 0);
                        ctx.putImageData(archRight, i * 16, 16);
                        ctx.putImageData(archRightUnder, i * 16, 32);
                        ctx.putImageData(archRightUnder, i * 16, 48);
                    }
                }
                ctx.putImageData(pilTopLeft, 0, 0);
                ctx.putImageData(pilTopRight, (width - 1) * 16, 0);
                return canvas.toDataURL('image/png');
            }
            else if (objNum === 0x37) {
                const mode = ((settings >>> 0) & 0b1111);
                let tile1, tile2;
                if (mode === 0) {
                    tile1 = getMap16TileImg(0xbd);
                    tile2 = getMap16TileImg(0xbe);
                }
                else if (mode === 1) {
                    tile1 = getMap16TileImg(0xbf);
                    tile2 = getMap16TileImg(0xc0);
                }
                for (let i = 0; i < height; i++) {
                    if (i % 2 === 0) {
                        ctx.putImageData(tile1, 0, i * 16);
                    }
                    else {
                        ctx.putImageData(tile2, 0, i * 16);
                    }
                }
                return canvas.toDataURL('image/png');
            }
            else if (objNum === 0x36) {
                // big trunk
                const width = getWidth(objNum, settings, tileset);
                const height = getHeight(objNum, settings, tileset);
                for (let i = 0; i < width; i++) {
                    for (let j = 0; j < height; j++) {
                        if (i % 2 === 0) {
                            if (j % 2 === 0) {
                                const tile = getMap16TileImg(0xb9);
                                ctx.putImageData(tile, i * 16, j * 16);
                            }
                            else {
                                const tile = getMap16TileImg(0xbb);
                                ctx.putImageData(tile, i * 16, j * 16);
                            }
                        }
                        else {
                            if (j % 2 === 0) {
                                const tile = getMap16TileImg(0xba);
                                ctx.putImageData(tile, i * 16, j * 16);
                            }
                            else {
                                const tile = getMap16TileImg(0xbc);
                                ctx.putImageData(tile, i * 16, j * 16);
                            }
                        }
                    }
                }
                return canvas.toDataURL('image/png');
            }
            else if (objNum === 0x3D) {
                const mode = ((settings >>> 4) & 0b1111);
                if (mode === 0) {
                    return single_block_image(objNum, settings, tileset, 0x93);
                }
                else if (mode === 1) {
                    return single_block_image(objNum, settings, tileset, 0x9c);
                }
            }
            else if (objNum === 0x3e) {
                const mode = ((settings >>> 0) & 0b1111);
                if (mode === 0) {
                    return bone_like_image(objNum, settings, tileset, 0x94, 0x8f, 0x8f);
                }
                else if (mode === 1) {
                    return bone_like_image(objNum, settings, tileset, 0x8f, 0x8f, 0x8f);
                }
                else if (mode === 2) {
                    return bone_like_image(objNum, settings, tileset, 0x9d, 0x98, 0x98);
                }
                else if (mode === 3) {
                    return bone_like_image(objNum, settings, tileset, 0x98, 0x98, 0x98);
                }
                else if (mode === 4) {
                    return bone_like_image(objNum, settings, tileset, 0x95, 0x90, 0x90);
                }
                else if (mode === 5) {
                    return bone_like_image(objNum, settings, tileset, 0x90, 0x90, 0x90);
                }
                else if (mode === 6) {
                    return bone_like_image(objNum, settings, tileset, 0x9e, 0x99, 0x99);
                }
                else if (mode === 7) {
                    return bone_like_image(objNum, settings, tileset, 0x99, 0x99, 0x99);
                }
            }
            else if (objNum === 0x39) {
                return diagonal_pipe_image(objNum, settings, tileset);
            }
            else if (objNum === 0x3A) {
                return hill_image(objNum, settings, tileset);
            }
            else if (objNum === 0x3B) {
                return hill_rev_image(objNum, settings, tileset);
            }
        }
        else if (tileset === 2) {
            // athletic
            if (objNum === 0x33) {
                // blue switch
                return single_block_image(objNum, settings, tileset, 0x16C);
            }
            else if (objNum === 0x34) {
                // red switch
                return single_block_image(objNum, settings, tileset, 0x16D);
            }
            else if (objNum === 0x37) {
                const mode = ((settings >>> 0) & 0b1111);
                if (mode === 2) {
                    return steep_slope_image(objNum, settings, tileset, 0x1CF, 0x1F4, 0x25);
                }
                else if (mode === 3) {
                    return steep_slope_image(objNum, settings, tileset, 0x1D0, 0x1F5, 0x25);
                }
                else if (mode === 0) {
                    return steep_slope_2_image(objNum, settings, tileset, 0x1CE, 0x1F3, 0x25);
                }
                else if (mode === 1) {
                    return steep_slope_2_image(objNum, settings, tileset, 0x1D1, 0x1F6, 0x25);
                }
            }
            else if (objNum === 0x3B) {
                const type = (settings >>> 4) & 0b1111;
                if (type === 1) {
                    return very_steep_slope_image(objNum, settings, tileset, 0x89, 0x8B, 0x25, 0x25);
                }
                else if (type === 0) {
                    return very_steep_slope_2_image(objNum, settings, tileset, 0x88, 0x8A, 0x25, 0x25);
                }
            }
            else if (objNum === 0x3A) {
                const type = (settings >>> 0) & 0b1111;
                if (type === 2) {
                    return normal_slope_image(objNum, settings, tileset, 0x8E, 0x8F, 0x25, 0x25);
                }
                else if (type === 3) {
                    return steep_slope_image(objNum, settings, tileset, 0x87, 0x25, 0x25);
                }
                else if (type === 5) {
                    return steep_slope_image(objNum, settings, tileset, 0x95, 0x25, 0x25);
                }
                else if (type === 0) {
                    return normal_slope_2_image(objNum, settings, tileset, 0x8C, 0x8D, 0x25, 0x25);
                }
                else if (type === 1) {
                    return steep_slope_2_image(objNum, settings, tileset, 0x86, 0x25, 0x25);
                }
                else if (type === 4) {
                    return steep_slope_2_image(objNum, settings, tileset, 0x94, 0x25, 0x25);
                }
            }
            else if (objNum === 0x3c) {
                return grass_like_image(objNum, settings, tileset, 0x107, 0x108, 0x109);
            }
            else if (objNum === 0x3d) {
                return grass_like_image(objNum, settings, tileset, 0x73, 0x74, 0x75);
            }
            else if (objNum === 0x3E) {
                return grass_like_image(objNum, settings, tileset, 0x159, 0x15A, 0x15B);
            }
            else if (objNum === 0x3F) {
                return bone_like_image(objNum, settings, tileset, 0x15C, 0x15D, 0x15E);
            }
            else if (objNum === 0x39 && ((settings) & 0b1111) === 2) {
                return single_block_image(objNum, settings, tileset, 0xA2);
            }
            else if (objNum === 0x32) {
                return bridge_like_image(objNum, settings, tileset, 0xA3, 0x10E);
            }
            else if (objNum === 0x35) {
                const mode = ((settings >>> 0) & 0b1111);
                let leafLeft;
                let leafRight;
                if (mode === 0) {
                    leafLeft = getMap16TileImg(0x9A);
                    leafRight = getMap16TileImg(0x9B);
                }
                else if (mode === 1) {
                    leafLeft = getMap16TileImg(0x9C);
                    leafRight = getMap16TileImg(0x9D);
                }
                else if (mode === 2) {
                    leafLeft = getMap16TileImg(0x9E);
                    leafRight = getMap16TileImg(0x9F);
                }
                else if (mode === 3) {
                    leafLeft = getMap16TileImg(0xA0);
                    leafRight = getMap16TileImg(0xA1);
                }
                const topLeft = getMap16TileImg(0x15F);
                const topRight = getMap16TileImg(0x160);
                const btm1Left = getMap16TileImg(0x161);
                const btm1Right = getMap16TileImg(0x162);
                const btm2Left = getMap16TileImg(0x163);
                const btm2Right = getMap16TileImg(0x164);
                const btm3Left = getMap16TileImg(0x165);
                const btm3Right = getMap16TileImg(0x166);
                for (let i = 0; i < height; i++) {
                    if (i % 3 === 0) {
                        ctx.putImageData(btm2Left, 0, i * 16);
                        ctx.putImageData(btm2Right, 16, i * 16);
                    }
                    else if (i % 3 === 1) {
                        ctx.putImageData(btm3Left, 0, i * 16);
                        ctx.putImageData(btm3Right, 16, i * 16);
                    }
                    else {
                        ctx.putImageData(btm1Left, 0, i * 16);
                        ctx.putImageData(btm1Right, 16, i * 16);
                    }
                }
                ctx.putImageData(leafLeft, 0, 0);
                ctx.putImageData(leafRight, 16, 0);
                ctx.putImageData(topLeft, 0, 16);
                ctx.putImageData(topRight, 16, 16);
                return canvas.toDataURL("image/png");
            }
            else if (objNum === 0x36) {
                const mode = ((settings >>> 4) & 0b1111);
                if (mode === 0) {
                    return single_block_image(objNum, settings, tileset, 0x10C);
                }
                else if (mode === 1) {
                    return single_block_image(objNum, settings, tileset, 0x10D);
                }
            }
            else if (objNum === 0x38) {
                const mode = ((settings >>> 4) & 0b1111);
                if (mode === 0) {
                    return single_block_image(objNum, settings, tileset, 0x92);
                }
                else if (mode === 1) {
                    return single_block_image(objNum, settings, tileset, 0x93);
                }
            }
            else if (objNum === 0x39) {
                const mode = ((settings >>> 0) & 0b1111);
                if (mode === 0) {
                    return single_block_image(objNum, settings, tileset, 0x90);
                }
                else if (mode === 1) {
                    return single_block_image(objNum, settings, tileset, 0x91);
                }
            }
        }
        else if (tileset === 4) {
            // ghost house or switch palace
            if (objNum === 0x36) {
                return single_block_image(objNum, settings, tileset, 0x15e);
            }
            else if (objNum === 0x35) {
                return single_block_image(objNum, settings, tileset, 0x92);
            }
            else if (objNum === 0x2F) {
                return single_block_image(objNum, settings, tileset, 0x82);
            }
            else if (objNum === 0x37 && ((settings >>> 4) & 0b1111) === 0) {
                return single_block_image(objNum, settings, tileset, 0x82);
            }
            else if (objNum === 0x37 && ((settings >>> 4) & 0b1111) === 2) {
                return single_block_image(objNum, settings, tileset, 0x88);
            }
            else if (objNum === 0x37 && ((settings >>> 4) & 0b1111) === 1) {
                return grass_like_image(objNum, settings, tileset, 0x89, 0x8A, 0x8B);
            }
            else if (objNum === 0x39 && ((settings >>> 0) & 0b1111) === 0) {
                return single_block_image(objNum, settings, tileset, 0x83);
            }
            else if (objNum === 0x39 && ((settings >>> 0) & 0b1111) === 2) {
                return single_block_image(objNum, settings, tileset, 0x79);
            }
            else if (objNum === 0x39 && ((settings >>> 0) & 0b1111) === 1) {
                return bone_like_image(objNum, settings, tileset, 0x78, 0x79, 0x79);
            }
            else if (objNum === 0x3A && ((settings >>> 0) & 0b1111) === 0) {
                return single_block_image(objNum, settings, tileset, 0x15F);
            }
            else if (objNum === 0x3A && ((settings >>> 0) & 0b1111) === 1) {
                return single_block_image(objNum, settings, tileset, 0x160);
            }
            else if (objNum === 0x3A && ((settings >>> 0) & 0b1111) === 2) {
                return single_block_image(objNum, settings, tileset, 0x15a);
            }
            else if (objNum === 0x3A && ((settings >>> 0) & 0b1111) === 3) {
                return single_block_image(objNum, settings, tileset, 0x15b);
            }
            else if (objNum === 0x3A && ((settings >>> 0) & 0b1111) === 4) {
                return single_block_image(objNum, settings, tileset, 0x1A5);
            }
            else if (objNum === 0x3A && ((settings >>> 0) & 0b1111) === 5) {
                return single_block_image(objNum, settings, tileset, 0x159);
            }
            else if (objNum === 0x3A && ((settings >>> 0) & 0b1111) === 6) {
                return single_block_image(objNum, settings, tileset, 0x129);
            }
            else if (objNum === 0x3A && ((settings >>> 0) & 0b1111) === 7) {
                return single_block_image(objNum, settings, tileset, 0x10F);
            }
            else if (objNum === 0x3A && ((settings >>> 0) & 0b1111) === 8) {
                return single_block_image(objNum, settings, tileset, 0x1AA);
            }
            else if (objNum === 0x2E) {
                return single_block_image(objNum, settings, tileset, 0x159);
            }
            else if (objNum === 0x38) {
                return grass_like_image(objNum, settings, tileset, 0x10A, 0x10B, 0x10C);
            }
            else if (objNum === 0x32) {
                return bridge_like_image(objNum, settings, tileset, 0x10E, 0xA3);
            }
            else if (objNum === 0x33) {
                return grass_like_image(objNum, settings, tileset, 0xA0, 0xA1, 0xA2);
            }
            else if (objNum === 0x30) {
                return bone_like_image(objNum, settings, tileset, 0x10F, 0xEA, 0xEA);
            }
            else if (objNum === 0x3B) {
                return grass_like_image(objNum, settings, tileset, 0x107, 0x108, 0x109);
            }
            else if (objNum === 0x3C) {
                return bone_like_image(objNum, settings, tileset, 0x153, 0x153, 0x154);
            }
            else if (objNum === 0x3D) {
                return bone_like_image(objNum, settings, tileset, 0x15D, 0x153, 0x153);
            }
            else if (objNum === 0x3E) {
                return grass_like_image(objNum, settings, tileset, 0x153, 0x153, 0x155);
            }
            else if (objNum === 0x3F) {
                return grass_like_image2(objNum, settings, tileset, 0x15C, 0x153, 0x153);
            }
            else if (objNum === 0x34) {
                const width = getWidth(objNum, settings, tileset);
                const height = getHeight(objNum, settings, tileset);
                const topLeft = getMap16TileImg(0x10A);
                const topCenter = getMap16TileImg(0x10B);
                const topRight = getMap16TileImg(0x10C);
                const col = getMap16TileImg(0x79);
                const coltop = getMap16TileImg(0x78);
                for (let i = 0; i < width; i++) {
                    ctx.putImageData(topCenter, i * 16, 0);
                }
                ctx.putImageData(topLeft, 0, 0);
                ctx.putImageData(topRight, (width - 1) * 16, 0);
                for (let i = 0; i < width; i++) {
                    if (i % 4 === 1) {
                        for (let j = 1; j < height; j++) {
                            ctx.putImageData(col, i * 16, j * 16);
                        }
                        ctx.putImageData(coltop, i * 16, 16);
                    }
                }
                return canvas.toDataURL('image/png');
            }
            else if (objNum === 0x31) {
                const width = getWidth(objNum, settings, tileset);
                const height = getHeight(objNum, settings, tileset);
                ctx.putImageData(stone_like_image_real(objNum, settings, tileset, 0x161, 0x10D, 0x162, 0x165, 0xC8, 0x16A, 0x16B, 0x16C, 0x16D), 0, 0);
                for (let i = 1; i < height - 1; i++) {
                    if (i % 2 === 1) {
                        const left = getMap16TileImg(0x163);
                        const center = getMap16TileImg(0xC7);
                        const right = getMap16TileImg(0x164);
                        for (let j = 0; j < width; j++) {
                            ctx.putImageData(center, j * 16, i * 16);
                        }
                        ctx.putImageData(left, 0, i * 16);
                        ctx.putImageData(right, (width - 1) * 16, i * 16);
                    }
                }
                return canvas.toDataURL('image/png');
            }
        }
        else if (tileset === 3) {
            // underground
            if (objNum === 0x34) {
                return single_block_image(objNum, settings, tileset, 0x16C);
            }
            else if (objNum === 0x37) {
                return canvasses_image(objNum, settings, tileset);
            }
            else if (objNum === 0x35) {
                return single_block_image(objNum, settings, tileset, 0x16D);
            }
            else if (objNum === 0x39) {
                // lava
                let height, type;
                type = (settings >>> 0) & 0b1111;
                height = ((settings >>> 4) & 0b1111) + 1;
                if (type === 2) {
                    return normal_slope_image(objNum, settings, tileset, 0x1D4, 0x1D5, 0x1FF, 0x1FC, 0x1FF);
                }
                else if (type === 3) {
                    return steep_slope_image(objNum, settings, tileset, 0x1D7, 0x1FE, 0x1FF);
                }
                else if (type === 0) {
                    return normal_slope_2_image(objNum, settings, tileset, 0x1D2, 0x1D3, 0x1FB, 0x1FF, 0x1FF);
                }
                else if (type === 1) {
                    return steep_slope_2_image(objNum, settings, tileset, 0x1d6, 0x1FD, 0x1FF);
                }
            }
            else if (objNum === 0x3f) {
                return single_block_image(objNum, settings, tileset, 0x165);
            }
            else if (objNum === 0x3e) {
                const mode = ((settings >>> 0) & 0b1111);
                if (mode === 0) {
                    return bone_like_image(objNum, settings, tileset, 0x150, 0x150, 0x14D);
                }
                else if (mode === 1) {
                    return bone_like_image(objNum, settings, tileset, 0x150, 0x150, 0x150);
                }
                else if (mode === 2) {
                    return bone_like_image(objNum, settings, tileset, 0x151, 0x151, 0x14F);
                }
                else if (mode === 3) {
                    return bone_like_image(objNum, settings, tileset, 0x151, 0x151, 0x151);
                }
            }
            else if (objNum === 0x3C) {
                // slope
                let height, type;
                type = (settings >>> 4) & 0b1111;
                height = ((settings >>> 0) & 0b1111) + 1;
                if (type === 1) {
                    return very_steep_slope_image(objNum, settings, tileset, 0x1CC, 0x1CD, 0x1F2, 0x3F);
                }
                else if (type === 0) {
                    return very_steep_slope_2_image(objNum, settings, tileset, 0x1CA, 0x1CB, 0x1F1, 0x3F);
                }
            }
            else if (objNum === 0x3d) {
                return bone_like_image(objNum, settings, tileset, 0x165, 0x165, 0x14e);
            }
            else if (objNum === 0x3b) {
                return single_block_image(objNum, settings, tileset, 0x1ff);
            }
            else if (objNum === 0x3a) {
                return bone_like_image(objNum, settings, tileset, 0x159, 0x1ff, 0x1ff);
            }
            else if (objNum === 0x38) {
                const mode = ((settings >>> 0) & 0b1111);
                if (mode === 0) {
                    return bone_like_image(objNum, settings, tileset, 0x15a, 0x15b, 0x15b);
                }
                else if (mode === 1) {
                    return bone_like_image(objNum, settings, tileset, 0x1ff, 0x1ff, 0x1ff);
                }
            }
            else if (objNum === 0x36) {
                return stone_like_image(objNum, settings, tileset, 0x145, 0x100, 0x148, 0x150, 0x1F0, 0x151, 0x14D, 0x14E, 0x14F);
            }
        }
        else if (tileset === 1) {
            // castle
            if (objNum === 0x39) {
                // blue switch
                return single_block_image(objNum, settings, tileset, 0x16C);
            }
            else if (objNum === 0x3a) {
                // red switch
                return single_block_image(objNum, settings, tileset, 0x16D);
            }
            else if (objNum === 0x3b) {
                return bone_like_image(objNum, settings, tileset, 0x109, 0x86, 0x86);
            }
            else if (objNum === 0x3c) {
                return stone_like_image(objNum, settings, tileset, 0x15d, 0x15e, 0x15f, 0x160, 0x161, 0x162, 0x163, 0x164, 0x165);
            }
            else if (objNum === 0x3d) {
                // escalator
                let height, type;
                type = (settings >>> 0) & 0b1111;
                height = ((settings >>> 4) & 0b1111) + 1;
                if (type === 2) {
                    return steep_slope_image(objNum, settings, tileset, 0x1CF, 0x1F4, 0x3F);
                }
                else if (type === 3) {
                    return steep_slope_image(objNum, settings, tileset, 0x1D0, 0x1F5, 0X3F);
                }
                else if (type === 0) {
                    return steep_slope_2_image(objNum, settings, tileset, 0x1D1, 0x1F6, 0x3F);
                }
                else if (type === 1) {
                    return steep_slope_2_image(objNum, settings, tileset, 0x1CE, 0x1F3, 0x3F);
                }
            }
            else if (objNum === 0x3f) {
                const mode = ((settings >>> 0) & 0b1111);
                if (mode === 0) {
                    return single_block_image(objNum, settings, tileset, 0x15b);
                }
                else if (mode === 1) {
                    return single_block_image(objNum, settings, tileset, 0x15c);
                }
                else if (mode === 2) {
                    return single_block_image(objNum, settings, tileset, 0x153);
                }
            }
            else if (objNum === 0x3e) {
                const mode = ((settings >>> 4) & 0b1111);
                if (mode === 0) {
                    return single_block_image(objNum, settings, tileset, 0x15a);
                }
                else if (mode === 1) {
                    return single_block_image(objNum, settings, tileset, 0x159);
                }
            }
            else if (objNum === 0x37) {
                const mode = ((settings >>> 4) & 0b1111);
                if (mode === 0) {
                    return single_block_image(objNum, settings, tileset, 0x92);
                }
                else if (mode === 1) {
                    return single_block_image(objNum, settings, tileset, 0x93);
                }
            }
            else if (objNum === 0x38) {
                const mode = ((settings >>> 0) & 0b1111);
                if (mode === 0) {
                    return single_block_image(objNum, settings, tileset, 0x90);
                }
                else if (mode === 1) {
                    return single_block_image(objNum, settings, tileset, 0x91);
                }
            }
            else if (objNum === 0x34) {
                return stone_like_image(objNum, settings, tileset, 0x133, 0x25, 0x134, 0x9d, 0x25, 0x9e, 0x133, 0x25, 0x134);
            }
            else if (objNum === 0x35) {
                // hot wall
                const width = getWidth(objNum, settings, tileset);
                const height = getHeight(objNum, settings, tileset);
                for (let i = 0; i < width; i++) {
                    for (let j = 0; j < height; j++) {
                        if (i % 2 === 0) {
                            if (j % 2 === 0) {
                                const tile = getMap16TileImg(0x94);
                                ctx.putImageData(tile, i * 16, j * 16);
                            }
                            else {
                                const tile = getMap16TileImg(0x96);
                                ctx.putImageData(tile, i * 16, j * 16);
                            }
                        }
                        else {
                            if (j % 2 === 0) {
                                const tile = getMap16TileImg(0x95);
                                ctx.putImageData(tile, i * 16, j * 16);
                            }
                            else {
                                const tile = getMap16TileImg(0x97);
                                ctx.putImageData(tile, i * 16, j * 16);
                            }
                        }
                    }
                }
                return canvas.toDataURL('image/png');
            }
            else if (objNum === 0x36) {
                // spike
                const mode = ((settings >>> 0) & 0b1111);
                if (mode === 0) {
                    const width = getWidth(objNum, settings, tileset);
                    const height = getHeight(objNum, settings, tileset);
                    for (let i = 0; i < height; i++) {
                        if (i % 2 === 0) {
                            const left = getMap16TileImg(0x89);
                            const centleft = getMap16TileImg(0x166);
                            const centright = getMap16TileImg(0x167);
                            const right = getMap16TileImg(0x8A);
                            ctx.putImageData(left, 0, i * 16);
                            ctx.putImageData(centleft, 16, i * 16);
                            ctx.putImageData(centright, 32, i * 16);
                            ctx.putImageData(right, 48, i * 16);
                        }
                        else {
                            const left = getMap16TileImg(0x8B);
                            const centleft = getMap16TileImg(0x168);
                            const centright = getMap16TileImg(0x169);
                            const right = getMap16TileImg(0x8C);
                            ctx.putImageData(left, 0, i * 16);
                            ctx.putImageData(centleft, 16, i * 16);
                            ctx.putImageData(centright, 32, i * 16);
                            ctx.putImageData(right, 48, i * 16);
                        }
                        const left = getMap16TileImg(0x25);
                        const centleft = getMap16TileImg(0x8d);
                        const centright = getMap16TileImg(0x8e);
                        const right = getMap16TileImg(0x25);
                        ctx.putImageData(left, 0, (height - 1) * 16);
                        ctx.putImageData(centleft, 16, (height - 1) * 16);
                        ctx.putImageData(centright, 32, (height - 1) * 16);
                        ctx.putImageData(right, 48, (height - 1) * 16);
                    }
                    return canvas.toDataURL('image/png');
                }
                else if (mode === 1) {
                    const width = getWidth(objNum, settings, tileset);
                    const height = getHeight(objNum, settings, tileset);
                    for (let i = 0; i < height; i++) {
                        if (i % 2 === 0) {
                            const left = getMap16TileImg(0x8B);
                            const centleft = getMap16TileImg(0x168);
                            const centright = getMap16TileImg(0x169);
                            const right = getMap16TileImg(0x8C);
                            ctx.putImageData(left, 0, i * 16);
                            ctx.putImageData(centleft, 16, i * 16);
                            ctx.putImageData(centright, 32, i * 16);
                            ctx.putImageData(right, 48, i * 16);
                        }
                        else {
                            const left = getMap16TileImg(0x89);
                            const centleft = getMap16TileImg(0x166);
                            const centright = getMap16TileImg(0x167);
                            const right = getMap16TileImg(0x8A);
                            ctx.putImageData(left, 0, i * 16);
                            ctx.putImageData(centleft, 16, i * 16);
                            ctx.putImageData(centright, 32, i * 16);
                            ctx.putImageData(right, 48, i * 16);
                        }
                        const left = getMap16TileImg(0x25);
                        const centleft = getMap16TileImg(0x87);
                        const centright = getMap16TileImg(0x88);
                        const right = getMap16TileImg(0x25);
                        ctx.putImageData(left, 0, 0);
                        ctx.putImageData(centleft, 16, 0);
                        ctx.putImageData(centright, 32, 0);
                        ctx.putImageData(right, 48, 0);
                    }
                    return canvas.toDataURL('image/png');
                }
            }
        }
    }
    return undefined_obj_image(objNum, settings, tileset);
}
function getBackAreaColor(backAreaColorNum) {
    let temp;
    let r, g, b;
    let bgColor;
    temp = fileData[snes2pc(0x00B0A0 + (backAreaColorNum * 2 + 1))] << 8 | fileData[snes2pc((0x00B0A0) + (backAreaColorNum * 2))];
    // convert bgColor
    r = (temp & 0b11111) * 8;
    g = ((temp >> 5) & 0b11111) * 8;
    b = ((temp >> 10) & 0b11111) * 8;
    bgColor = new RGB();
    bgColor.r = r;
    bgColor.g = g;
    bgColor.b = b;
    return bgColor;
}
function getBGPage(bgPointer) {
    let bgPage;
    if (bgPointer < 0xCE8FE) {
        bgPage = 0;
    }
    else {
        bgPage = 1;
    }
    return bgPage;
}
function loadBG(bgPointer) {
    let temp, temp1;
    let bgData;
    if (!bgPointer) {
        return null;
    }
    temp = decompress_rle1(fileData.slice(snes2pc(bgPointer)));
    temp1 = new Array(temp.length);
    for (let i = 0; i < temp1.length; i++) {
        temp1[i] = 0;
    }
    for (let i = 0; i < Math.floor(temp.length / 2); i++) {
        temp1[intdiv(i, 16) * 16 + i] = temp[i];
    }
    for (let i = Math.floor(temp.length / 2); i < temp.length; i++) {
        //console.log(temp[i]);
    }
    temp = temp.slice(Math.floor(temp.length / 2));
    for (let i = 0; i < temp.length; i++) {
        temp1[(intdiv(i, 16) + 1) * 16 + i] = temp[i];
    }
    bgData = temp1;
    return bgData;
}
function convertGraphics(org, is4bpp = false) {
    if (org.length === 0) {
        const result = new Array(0x80);
        for (let i = 0; i < 0x80; i++) {
            result[i] = new Array(64);
            for (let j = 0; j < 64; j++) {
                result[i][j] = 0;
            }
        }
        return result;
    }
    if (is4bpp) {
        return convertGraphics4bpp(org);
    }
    else {
        return convertGraphics3bpp(org);
    }
}
function convertGraphics3bpp(org) {
    let bitmapTiles = new Array(16 * 8);
    const limit = 768;
    for (let i = 0; i < limit; i++) {
        let bitmap = new Array(64);
        for (let c = 0; c < 8; c++) {
            for (let k = 0; k < 8; k++) {
                bitmap[8 * c + k] = ((org[(i * 24) + 2 * c + 0] >>> (7 - k)) & 1) << 0;
            }
            for (let k = 0; k < 8; k++) {
                bitmap[8 * c + k] |= ((org[(i * 24) + 2 * c + 1] >>> (7 - k)) & 1) << 1;
            }
        }
        for (let c = 0; c < 8; c++) {
            for (let k = 0; k < 8; k++) {
                bitmap[8 * c + k] |= ((org[(i * 24) + 16 + c] >>> (7 - k)) & 1) << 2;
            }
        }
        bitmapTiles[i] = bitmap;
    }
    return bitmapTiles;
}
function convertGraphics4bpp(org) {
    let bitmapTiles = new Array(16 * 8);
    const limit = 768;
    for (let i = 0; i < limit; i++) {
        let bitmap = new Array(64);
        for (let c = 0; c < 8; c++) {
            for (let k = 0; k < 8; k++) {
                bitmap[8 * c + k] = ((org[(i * 32) + 2 * c + 0] >>> (7 - k)) & 1) << 0;
            }
            for (let k = 0; k < 8; k++) {
                bitmap[8 * c + k] |= ((org[(i * 32) + 2 * c + 1] >>> (7 - k)) & 1) << 1;
            }
        }
        for (let c = 0; c < 8; c++) {
            for (let k = 0; k < 8; k++) {
                bitmap[8 * c + k] |= ((org[(i * 32) + 16 + 2 * c + 0] >>> (7 - k)) & 1) << 2;
            }
            for (let k = 0; k < 8; k++) {
                bitmap[8 * c + k] |= ((org[(i * 32) + 16 + 2 * c + 1] >>> (7 - k)) & 1) << 3;
            }
        }
        bitmapTiles[i] = bitmap;
    }
    return bitmapTiles;
}
function fileOpen() {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".smc";
    fileInput.onchange = function () {
        if (this.files.length != 1) {
            return;
        }
        fileName = this.files[0].name;
        const fr = new FileReader();
        fr.onload = function () {
            fileData = new Uint8Array(this.result);
            let levelNum; // = 0x105;
            if (levelNum === undefined) {
                try {
                    let input;
                    input = prompt("Input the level number (in hex)", "105");
                    if (!input)
                        return;
                    levelNum = safeParseInt("0x" + input);
                }
                catch (e) {
                    alert("Wrong input");
                    return;
                }
            }
            try {
                loadROM(levelNum, fileData);
            }
            catch (e) {
                throw e;
                //alert(e.message)
                //unload();
            }
            btnOpen.disabled = true;
            btnPalette.disabled = false;
            btn8x8.disabled = false;
            btn16x16.disabled = false;
            btnLevelHeader.disabled = false;
            btnLevelToImage.disabled = false;
            btnGFX.disabled = false;
            btnSprHeader.disabled = false;
            btnOtherHeader.disabled = false;
            btnEnter.disabled = false;
            btnSwitchBG.disabled = false;
            btnExit.disabled = false;
            btn2ndExit.disabled = false;
            //btnSave.disabled = false;
        };
        fr.readAsArrayBuffer(this.files[0]);
    };
    fileInput.click();
}
function getPalImage(pal) {
    const canvas = document.createElement("canvas");
    canvas.width = 8 * 16 * 2;
    canvas.height = 8 * 16 * 2;
    const ctx = canvas.getContext("2d");
    for (let i = 0; i < pal.length; i++) {
        for (let j = 0; j < pal[i].length; j++) {
            let r, g, b;
            r = pal[i][j].r;
            g = pal[i][j].g;
            b = pal[i][j].b;
            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            ctx.fillRect(j * 8 * 2, i * 8 * 2, 8 * 2, 8 * 2);
        }
    }
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
}
function getMap16TileImg(index, bg = false) {
    let canvas = document.createElement("canvas");
    canvas.style.border = "1px solid black";
    canvas.width = 16;
    canvas.height = 16;
    let ctx = canvas.getContext("2d");
    let blocks;
    let firstBmp, secondBmp, thirdBmp, fourthBmp;
    if (bg) {
        blocks = bgTiles;
    }
    else {
        blocks = map16;
    }
    let i = index;
    {
        let div, mod;
        let blockx, blocky;
        let flipx, flipy;
        let bitmap;
        let leftIndex, topIndex, index;
        blockx = i % 16;
        blocky = Math.floor(i / 16);
        let block = blocks[i];
        if (typeof block == "undefined") {
            console.log("undefined");
            const tilePart = new TilePart();
            tilePart.gfx = 0x4;
            tilePart.pal = 0x4;
            block = new Tile();
            block.upleft = tilePart;
            block.upright = tilePart;
            block.lowleft = tilePart;
            block.lowright = tilePart;
        }
        else {
        }
        const col = [block.upleft, block.upright, block.lowleft, block.lowright];
        for (let j = 0; j < 4; j++) {
            const gfx = col[j].gfx;
            const palette = col[j].pal;
            const flipx = col[j].xflip;
            const flipy = col[j].yflip;
            const div = Math.floor(gfx / 0x80);
            const mod = gfx % 0x80;
            let bitmap;
            if (div === 0) {
                bitmap = fg1bmp;
            }
            else if (div === 1) {
                bitmap = fg2bmp;
            }
            else if (div === 2) {
                bitmap = bgbmp;
            }
            else if (div === 3) {
                bitmap = fg3bmp;
            }
            else if (div === 4) {
                bitmap = bg2bmp;
            }
            else if (div === 5) {
                bitmap = bg3bmp;
            }
            else {
                return ctx.getImageData(0, 0, 16, 16);
            }
            for (let k = 0; k < 8; k++) {
                for (let l = 0; l < 8; l++) {
                    let r, g, b;
                    leftIndex = l;
                    if (flipx) {
                        leftIndex = 7 - l;
                    }
                    topIndex = k;
                    if (flipy) {
                        topIndex = 7 - k;
                    }
                    index = topIndex * 8 + leftIndex;
                    let alpha = 1.0;
                    if (bitmap[mod][index] === 0) {
                        alpha = 0.0;
                    }
                    r = pal[palette][bitmap[mod][index]].r;
                    g = pal[palette][bitmap[mod][index]].g;
                    b = pal[palette][bitmap[mod][index]].b;
                    setPoint(k + (intdiv(j, 2) * 8), l + (((j % 2)) * 8), r, g, b, ctx, alpha);
                }
            }
        }
    }
    return ctx.getImageData(0, 0, 16, 16);
}
function getBG(bgData, bgPage) {
    if (bgData === null) {
        return null;
    }
    const canvas = document.createElement("canvas");
    canvas.width = 32 * 16;
    canvas.height = 32 * 16;
    const ctx = canvas.getContext("2d");
    for (let i = 0; i < bgData.length; i++) {
        const value = bgData[i] + (bgPage * 0x100);
        const tile = getMap16TileImg(value, true);
        const x = i % 32;
        const y = Math.floor(i / 32);
        ctx.putImageData(tile, x * 16, y * 16);
    }
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
}
function getLevelBG() {
    const result = getBG(bgData, bgPage);
    if (result !== null) {
        return result;
    }
    else {
        return null;
    }
}
function renderBG() {
    const canvas = document.createElement("canvas");
    canvas.width = 32 * 16;
    canvas.height = 27 * 16;
    let bgBitmap = getLevelBG();
    const ctx = canvas.getContext("2d");
    if (bgBitmap !== null) {
        ctx.putImageData(bgBitmap, 0, 0);
    }
    document.getElementById("stage").style.backgroundImage = 'url(' + canvas.toDataURL("image/png") + ')';
}
function getWidth(objNum, settings, tileset = 0) {
    /* get objects width */
    const lookupTable = [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 2, 2, 1, 1, 2, 1, 1, 6, 4, 1, 1, 2, 2, 2,
        2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 48,
        1, 3, 3, 3, 2, 2, 4, 4, 1, 1, 1, 1, 1, 1, 1, 1,
        2, 4, 4, 4, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
        10, 1, 9, 6, 9, 16, 2, 1, 1, 1, 2, 2, 2, 2, 1, 2,
        2, 1, 1, 2, 2, 1, 1, 1,
    ];
    let result = 1;
    if (objNum == 0) {
        result = lookupTable[settings];
    }
    if (objNum >= 1 && objNum <= 0x0E) {
        result = (settings & 0b1111) + 1;
    }
    if (objNum === 0xF) {
        result = 2;
    }
    if (objNum === 0x10) {
        result = ((settings) & 0b1111) + 1;
    }
    if (objNum === 0x11) {
        result = 1;
    }
    if (objNum === 0x12) {
        // todo: left slope
        let height, type;
        type = (settings) & 0b1111;
        height = ((settings >>> 4) & 0b1111) + 1;
        switch (type) {
            case 0:
                return ((getHeight(objNum, settings, tileset) - 1) * 2);
                break;
            case 1:
                return getHeight(objNum, settings, tileset) - 1;
                break;
            case 2:
                return (4 * (getHeight(objNum, settings, tileset) - 1));
                break;
            case 3:
                result = height * 2;
                break;
            case 4:
                result = height;
                break;
            case 5:
                result = (height) * 4;
                break;
            case 6:
                result = (height - 1) * 2;
                break;
            case 7:
                result = (height - 1) * 2;
                break;
            case 8:
                result = (height - 1);
                break;
            case 9:
                result = (height - 1);
                break;
            default:
                result = 1;
                break;
        }
    }
    if (objNum >= 0x2E || objNum <= 0x3F) {
        // tileset spec width
        if (tileset == 0) {
            // forest
            if (objNum == 0x30) {
                result = 2;
            }
            else if (objNum >= 0x31 && objNum <= 0x32) {
                result = (settings & 0b1111) + 1;
            }
            else if (objNum == 0x33) {
                result = ((settings & 0b1111) + 1) * 16;
            }
            else if (objNum == 0x34) {
                result = 1;
            }
            else if (objNum == 0x35) {
                result = (settings & 0b1111) + 1;
            }
            else if (objNum == 0x36) {
                result = 2;
            }
            else if (objNum == 0x37) {
                result = 1;
            }
            else if (objNum == 0x38) {
                result = (settings & 0b1111) + 1;
            }
            else if (objNum == 0x39) {
                const height = getHeight(objNum, settings, tileset);
                if (height == 2) {
                    return 2;
                }
                else {
                    return 4 + (height - 3);
                }
            }
            else if (objNum == 0x3A) {
                const a = ((settings >>> 4) & 0b1111);
                const b = ((settings >>> 0) & 0b1111);
                return (a + 1) + ((b + 1) + (b + 1));
                //return getHeight(objNum, settings, tileset) + 3;
            }
            else if (objNum == 0x3B) {
                const a = ((settings >>> 4) & 0b1111);
                const b = ((settings >>> 0) & 0b1111);
                return (a + 1) + ((b + 1) + (b + 1));
            }
            else if (objNum == 0x3C) {
                result = (settings & 0b1111) * 3 + 1;
            }
            else if (objNum == 0x3D) {
                result = (settings & 0b1111) + 1;
            }
            else if (objNum == 0x3E) {
                result = 1;
            }
            else if (objNum == 0x3F) {
                result = (settings & 0b1111) + 1;
            }
        }
        else if (tileset == 1) {
            // castle
            if (objNum == 0x34) {
                result = 2;
            }
            else if (objNum == 0x35) {
                result = ((settings & 0b1111) + 1) * 2;
            }
            else if (objNum == 0x36) {
                result = 4;
            }
            else if (objNum == 0x37) {
                result = ((settings & 0b1111) + 1);
            }
            else if (objNum == 0x38) {
                result = 1;
            }
            else if (objNum == 0x39 || objNum == 0x3A) {
                result = ((settings & 0b1111) + 1);
            }
            else if (objNum == 0x3B) {
                result = ((settings & 0b1111) + 1);
            }
            else if (objNum == 0x3C) {
                result = ((settings & 0b1111) + 1);
            }
            else if (objNum == 0x3D) {
                // escalator
                let height, type;
                type = (settings >>> 0) & 0b1111;
                height = ((settings >>> 4) & 0b1111) + 1;
                if (type === 2 || type === 3) {
                    result = height;
                }
                else if (type === 0 || type === 1) {
                    result = height;
                }
            }
            else if (objNum == 0x3E) {
                result = ((settings & 0b1111) + 1);
            }
            else if (objNum == 0x3F) {
                result = 1;
            }
        }
        else if (tileset == 2) {
            // athletic
            if (objNum == 0x32) {
                result = ((settings & 0b1111) + 1);
            }
            else if (objNum == 0x33 || objNum == 0x34) {
                result = ((settings & 0b1111) + 1);
            }
            else if (objNum == 0x35) {
                result = 2;
            }
            else if (objNum == 0x36) {
                result = ((settings & 0b1111) + 1);
            }
            else if (objNum == 0x37) {
                let height, type;
                type = (settings >>> 0) & 0b1111;
                height = ((settings >>> 4) & 0b1111) + 1;
                if (type === 2) {
                    result = height;
                }
                else if (type === 3) {
                    result = height;
                }
                else if (type === 0) {
                    result = height;
                }
                else if (type === 1) {
                    result = height;
                }
            }
            else if (objNum == 0x38) {
                result = ((settings & 0b1111) + 1);
            }
            else if (objNum == 0x39) {
                result = 1;
            }
            else if (objNum == 0x3A) {
                let height, type;
                type = (settings) & 0b1111;
                height = ((settings >>> 4) & 0b1111) + 1;
                switch (type) {
                    case 2:
                        result = height * 2;
                        break;
                    case 3:
                        result = height;
                        break;
                    case 5:
                        result = height;
                        break;
                    case 0:
                        result = height * 2;
                        break;
                    case 1:
                        result = height;
                        break;
                    case 4:
                        result = height;
                        break;
                }
            }
            else if (objNum == 0x3B) {
                let height, type;
                type = (settings >>> 4) & 0b1111;
                height = ((settings >>> 0) & 0b1111) + 1;
                if (type === 1) {
                    result = height;
                }
                else if (type === 0) {
                    result = height;
                }
            }
            else if (objNum == 0x3C) {
                result = ((settings & 0b1111) + 1);
            }
            else if (objNum == 0x3D) {
                result = ((settings & 0b1111) + 1);
            }
            else if (objNum == 0x3E) {
                result = ((settings & 0b1111) + 1);
            }
            else if (objNum == 0x3F) {
                result = 1;
            }
        }
        else if (tileset == 3) {
            // underground
            if (objNum == 0x34 || objNum == 0x35) {
                result = ((settings & 0b1111) + 1);
            }
            else if (objNum == 0x36) {
                result = ((settings & 0b1111) + 1);
            }
            else if (objNum == 0x37) {
                const width = ((settings >>> 0) & 0b1111) + 1;
                return width * 16;
            }
            else if (objNum == 0x38) {
                result = 1;
            }
            else if (objNum == 0x39) {
                // lava
                let height, type;
                type = (settings >>> 0) & 0b1111;
                height = ((settings >>> 4) & 0b1111) + 1;
                if (type === 2) {
                    result = height * 2;
                }
                else if (type === 3) {
                    result = height;
                }
                else if (type === 0) {
                    result = height * 2;
                }
                else if (type === 1) {
                    result = height;
                }
            }
            else if (objNum == 0x3A || objNum == 0x3B) {
                result = ((settings & 0b1111) + 1);
            }
            else if (objNum == 0x3C) {
                // slope
                let height, type;
                type = (settings >>> 4) & 0b1111;
                height = ((settings >>> 0) & 0b1111) + 1;
                if (type === 0) {
                    //console.log ("type 1");
                    result = height;
                }
                else if (type === 1) {
                    //console.log ("type 2");
                    result = height;
                }
                else {
                    //console.log(objNum.toString(16));
                }
            }
            else if (objNum == 0x3D) {
                result = ((settings & 0b1111) + 1);
            }
            else if (objNum == 0x3E) {
                result = 1;
            }
            else if (objNum == 0x3F) {
                result = ((settings & 0b1111) + 1);
            }
        }
        else if (tileset == 4) {
            if (objNum == 0x2E) {
                result = ((settings & 0b1111) + 1);
            }
            else if (objNum == 0x2F) {
                result = ((settings & 0b1111) + 1);
            }
            else if (objNum == 0x30) {
                result = ((settings & 0b1111) + 1);
            }
            else if (objNum == 0x31) {
                result = ((settings & 0b1111) + 1);
            }
            else if (objNum == 0x32) {
                result = ((settings & 0b1111) + 1);
            }
            else if (objNum == 0x33) {
                result = ((settings & 0b1111) + 1);
            }
            else if (objNum == 0x34) {
                result = ((settings & 0b1111) + 1) * 4 - 1;
            }
            else if (objNum == 0x35 || objNum == 0x36) {
                result = ((settings & 0b1111) + 1);
            }
            else if (objNum == 0x37 || objNum == 0x38) {
                result = ((settings & 0b1111) + 1);
            }
            else if (objNum == 0x39 || objNum == 0x3a) {
                result = 1;
            }
            else if (objNum >= 0x3B && objNum <= 0x3e) {
                result = ((settings & 0b1111) + 1);
            }
            else if (objNum == 0x3f) {
                result = ((settings & 0b1111) + 2);
                if (result == 2)
                    result = 1;
            }
        }
    }
    if (objNum === 0x13) {
        result = 1;
    }
    if (objNum === 0x14) {
        result = (settings & 0b1111) + 1;
    }
    if (objNum === 0x15) {
        result = 3;
    }
    if (objNum >= 0x16 && objNum <= 0x1D) {
        result = (settings & 0b1111) + 1;
    }
    if (objNum >= 0x1E && objNum <= 0x1F) {
        result = 1;
    }
    if (objNum == 0x20) {
        result = (settings & 0b1111) + 1;
    }
    if (objNum == 0x21) {
        result = settings + 1;
    }
    return result;
}
function getHeight(objNum, settings, tileset = 0) {
    /* get object's height */
    const lookupTable = [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 2, 1, 1, 2, 2, 1, 2, 2, 13, 4, 1, 1, 2, 2, 2,
        2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 64,
        1, 3, 3, 3, 2, 2, 4, 4, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 6, 6, 6, 6, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2,
        14, 2, 5, 4, 14, 10, 2, 1, 1, 1, 2, 2, 2, 2, 1, 2,
        3, 2, 2, 2, 2, 3, 3, 1,
    ];
    let result = 1;
    if (objNum == 0x22 || objNum == 0x23) {
    }
    else if (objNum == 0) {
        result = lookupTable[settings];
    }
    else if (objNum >= 0x1 && objNum <= 0x0F) {
        result = ((settings >>> 4) & 0b1111) + 1;
    }
    else if (objNum == 0x10) {
        result = 2;
    }
    else if (objNum === 0x11) {
        // bullet bill shooter
        result = ((settings >>> 4) & 0b1111) + 1;
    }
    else if (objNum === 0x12) {
        // slope
        let type = (settings & 0b1111);
        result = ((settings >>> 4) & 0b1111) + 2;
        if (type === 6 || type === 7 || type === 8 || type === 9) {
            result--;
        }
    }
    else if (objNum === 0x13) {
        // edge
        let type = (settings & 0b1111);
        result = ((settings >>> 4) & 0b1111) + 1;
        if (type === 11 || type === 12 || type === 13 || type === 14) {
            result++;
        }
    }
    else if (objNum === 0x14) {
        // ground
        result = ((settings >>> 4) & 0b1111) + 1;
    }
    else if (objNum === 0x15) {
        // midway point
        result = ((settings >>> 4) & 0b1111) + 1;
    }
    else if (objNum === 0x16) {
        // purple coins
        result = ((settings >>> 4) & 0b1111) + 1;
    }
    else if (objNum == 0x17) {
        result = 1;
    }
    else if (objNum >= 0x18 && objNum <= 0x1B) {
        result = ((settings >>> 4) & 0b1111) + 1;
    }
    else if (objNum == 0x1C) {
        result = 2;
    }
    else if (objNum >= 0x1D && objNum <= 0x1F) {
        result = ((settings >>> 4) & 0b1111) + 1;
    }
    else if (objNum == 0x20) {
        result = 1;
    }
    else if (objNum == 0x21) {
        result = 3;
    }
    else if (objNum >= 0x2E || objNum <= 0x3F) {
        // tileset spec height
        if (tileset == 0) {
            if (objNum == 0x30) {
                result = (((settings >> 4) & 0b1111) + 1);
            }
            else if (objNum >= 0x31 && objNum <= 0x32) {
                result = (((settings >> 4) & 0b1111) + 1);
            }
            else if (objNum == 0x33) {
                result = 6;
            }
            else if (objNum == 0x34) {
                result = ((((settings >> 4) & 0b1111) + 1));
            }
            else if (objNum == 0x35) {
                result = (((settings >> 4) & 0b1111) + 1);
            }
            else if (objNum == 0x36) {
                result = ((((settings >> 4) & 0b1111) + 1));
            }
            else if (objNum == 0x37) {
                result = ((((settings >> 4) & 0b1111) + 1));
            }
            else if (objNum == 0x38) {
                result = (((settings >> 4) & 0b1111) + 1);
            }
            else if (objNum == 0x39) {
                result = ((settings >>> 4) & 0b1111) + 2;
            }
            else if (objNum == 0x3A) {
                // left hill
                const a = ((settings >>> 4) & 0b1111);
                const b = ((settings >>> 0) & 0b1111);
                return (a + 1) + (b + 1);
                //result = ((settings >>> 4) & 0b1111) + 4;
            }
            else if (objNum == 0x3B) {
                // right hill
                const a = ((settings >>> 4) & 0b1111);
                const b = ((settings >>> 0) & 0b1111);
                return (a + 1) + (b + 1);
            }
            else if (objNum == 0x3C) {
                result = 4;
            }
            else if (objNum == 0x3D) {
                result = 1;
            }
            else if (objNum == 0x3E) {
                result = ((((settings >> 4) & 0b1111) + 1));
            }
            else if (objNum == 0x3F) {
                result = 1;
            }
        }
        else if (tileset == 1) {
            if (objNum == 0x34) {
                result = (((settings >> 4) & 0b1111) + 1);
            }
            else if (objNum == 0x35) {
                result = (((settings >> 4) & 0b1111) + 1) * 2;
            }
            else if (objNum == 0x36) {
                result = (((settings >> 4) & 0b1111) + 1) + 1;
            }
            else if (objNum == 0x37) {
                result = 1;
            }
            else if (objNum == 0x38) {
                result = (((settings >> 4) & 0b1111) + 1);
            }
            else if (objNum == 0x39 || objNum == 0x3A) {
                result = (((settings >> 4) & 0b1111) + 1);
            }
            else if (objNum == 0x3B) {
                result = 2;
            }
            else if (objNum == 0x3C) {
                result = (((settings >> 4) & 0b1111) + 1);
            }
            else if (objNum == 0x3D) {
                result = (((settings >> 4) & 0b1111) + 1) + 1;
            }
            else if (objNum == 0x3E) {
                result = 1;
            }
            else if (objNum == 0x3F) {
                result = (((settings >> 4) & 0b1111) + 1);
            }
        }
        else if (tileset == 2) {
            if (objNum == 0x32) {
                result = 2;
            }
            else if (objNum == 0x33 || objNum == 0x34) {
                result = (((settings >> 4) & 0b1111) + 1);
            }
            else if (objNum == 0x35) {
                result = (((settings >> 4) & 0b1111) + 1);
            }
            else if (objNum == 0x36) {
                result = 1;
            }
            else if (objNum == 0x37) {
                result = (((settings >> 4) & 0b1111) + 2);
            }
            else if (objNum == 0x38) {
                result = 1;
            }
            else if (objNum == 0x39) {
                result = (((settings >> 4) & 0b1111) + 1);
            }
            else if (objNum == 0x3A) {
                result = (((settings >> 4) & 0b1111) + 1);
            }
            else if (objNum == 0x3B) {
                result = (((settings) & 0b1111) + 1) * 2;
            }
            else if (objNum == 0x3C) {
                result = 1;
            }
            else if (objNum == 0x3D) {
                result = (((settings >> 4) & 0b1111) + 1);
            }
            else if (objNum == 0x3E) {
                result = 1;
            }
            else if (objNum == 0x3F) {
                result = (((settings >> 4) & 0b1111) + 1);
            }
        }
        else if (tileset == 3) {
            if (objNum == 0x34 || objNum == 0x35) {
                result = (((settings >> 4) & 0b1111) + 1);
            }
            else if (objNum == 0x36) {
                result = (((settings >> 4) & 0b1111) + 1);
            }
            else if (objNum == 0x37) {
                result = 18;
            }
            else if (objNum == 0x38) {
                result = (((settings >> 4) & 0b1111) + 1);
            }
            else if (objNum == 0x39) {
                result = ((settings >>> 4) & 0b1111) + 2;
            }
            else if (objNum == 0x3A || objNum == 0x3B) {
                result = (((settings >> 4) & 0b1111) + 1);
            }
            else if (objNum == 0x3C) {
                result = (((settings) & 0b1111) + 1) * 2 + 1;
            }
            else if (objNum == 0x3D) {
                result = (((settings >> 4) & 0b1111) + 1);
            }
            else if (objNum == 0x3E) {
                result = (((settings >> 4) & 0b1111) + 1);
            }
            else if (objNum == 0x3F) {
                result = (((settings >> 4) & 0b1111) + 1);
            }
        }
        else if (tileset == 4) {
            if (objNum == 0x2E) {
                result = 1;
            }
            else if (objNum >= 0x2f && objNum <= 0x32) {
                result = (((settings >> 4) & 0b1111) + 1);
            }
            else if (objNum == 0x33) {
                result = 1;
            }
            else if (objNum == 0x34) {
                result = (((settings >> 4) & 0b1111) + 1);
            }
            else if (objNum >= 0x35 && objNum <= 0x36) {
                result = (((settings >> 4) & 0b1111) + 1);
            }
            else if (objNum == 0x37 || objNum == 0x38) {
                result = 1;
            }
            else if (objNum == 0x39 || objNum == 0x3A) {
                result = (((settings >> 4) & 0b1111) + 1);
            }
            else if (objNum == 0x3b) {
                result = 1;
            }
            else if (objNum >= 0x3c && objNum <= 0x3f) {
                result = (((settings >> 4) & 0b1111) + 1);
            }
        }
    }
    return result;
}
function getX(obj, tset = -1) {
    const objNum = obj.objNum;
    const settings = obj.settings;
    if (tset === -1) {
        tset = tileset;
    }
    switch (objNum) {
        case 0:
            {
                if (settings === 0x46) {
                    return obj.x - 1;
                }
                return obj.x;
            }
            break;
        case 0x12:
            {
                const type = ((settings >>> 0) & 0b1111);
                const height = getHeight(objNum, settings, tset);
                if (type === 0) {
                    return (obj.x + 2) - ((height - 1) * 2);
                }
                else if (type === 1) {
                    return obj.x - (height - 2);
                }
                else if (type === 2) {
                    return (obj.x + 4) - (4 * (height - 1));
                }
                else {
                    return obj.x;
                }
            }
            break;
        default:
            {
                if (tset === 0) {
                    // plain / forest
                    if (objNum === 0x3A) {
                        const a = (settings >>> 0) & 0b1111;
                        return obj.x - a;
                    }
                    else if (objNum === 0x39) {
                        return obj.x + 2 - getHeight(objNum, settings, tset);
                    }
                    else if (objNum === 0x3B) {
                        const a = (settings >>> 4) & 0b1111;
                        const b = (settings >>> 0) & 0b1111;
                        return obj.x - 1 - a - b;
                    }
                }
                else if (tset === 1) {
                    // castle
                    if (objNum === 0x3D) {
                        // escalator
                        let height, type;
                        type = (settings >>> 0) & 0b1111;
                        height = ((settings >>> 4) & 0b1111) + 1;
                        if (type === 0) {
                            //console.log(tset);
                            return obj.x + 1 - getWidth(objNum, settings, tset);
                        }
                        else if (type === 1) {
                            //console.log(tset);
                            return obj.x + 1 - getWidth(objNum, settings, tset);
                        }
                    }
                }
                else if (tset === 3) {
                    // underground
                    if (objNum === 0x3C) {
                        const type = (settings >>> 4) & 0b1111;
                        const height = ((settings >>> 0) & 0b1111) + 1;
                        if (type === 0) {
                            const width = getWidth(objNum, settings, tset);
                            return obj.x + 1 - width;
                        }
                    }
                    else if (objNum === 0x39) {
                        const type = (settings >>> 0) & 0b1111;
                        const width = getWidth(objNum, settings, tset);
                        if (type === 0) {
                            return obj.x + 2 - width;
                        }
                        else if (type === 1) {
                            return obj.x + 1 - width;
                        }
                    }
                    else if (objNum === 0x37) {
                        // canvasses
                        return 0;
                    }
                }
                else if (tset === 2) {
                    // athletic
                    if (objNum === 0x37) {
                        const type = (settings >>> 0) & 0b1111;
                        if (type === 0) {
                            return obj.x + 1 - getWidth(objNum, settings, tset);
                        }
                        else if (type === 1) {
                            return obj.x + 1 - getWidth(objNum, settings, tset);
                        }
                    }
                    else if (objNum === 0x3B) {
                        const type = (settings >>> 4) & 0b1111;
                        if (type === 0) {
                            const width = getWidth(objNum, settings, tset);
                            return obj.x + 1 - width;
                        }
                    }
                    else if (objNum === 0x3a) {
                        const type = (settings) & 0b1111;
                        const width = getWidth(objNum, settings, tset);
                        if (type === 0) {
                            return obj.x + 2 - width;
                        }
                        else if (type === 1) {
                            return obj.x + 1 - width;
                        }
                        else if (type === 4) {
                            return obj.x + 1 - width;
                        }
                    }
                }
                return obj.x;
            }
            break;
    }
    return obj.x;
}
function getY(obj, tset = -1) {
    const objNum = obj.objNum;
    if (tset === -1) {
        tset = tileset;
    }
    if (tset === 3) {
        if (objNum === 0x37) {
            // canvasses
            return 5;
        }
    }
    return obj.y;
}
function getRealY(y, obj, tset = -1) {
    const objNum = obj.objNum;
    if (tset === -1) {
        tset = tileset;
    }
    if (tset === 3) {
        if (objNum === 0x37) {
            return 0;
        }
    }
    return y;
}
function getRealX(x, obj, tset = -1) {
    const objNum = obj.objNum;
    const settings = obj.settings;
    if (tset === -1) {
        tset = tileset;
    }
    switch (objNum) {
        case 0:
            {
                if (settings === 0x46) {
                    return x + 1;
                }
                return x;
            }
            break;
        case 0x12:
            {
                const type = ((settings >>> 0) & 0b1111);
                const height = getHeight(objNum, settings, tset);
                if (type === 0) {
                    return x - 2 + ((height - 1) * 2);
                }
                else if (type === 1) {
                    return x + (height - 2);
                }
                else if (type === 2) {
                    return x - 4 + (4 * (height - 1));
                }
                else {
                    return x;
                }
            }
            break;
        default:
            {
                if (tset === 0) {
                    // plain
                    if (objNum === 0x3a) {
                        const a = (settings >>> 0) & 0b1111;
                        return x + a;
                    }
                    else if (objNum === 0x39) {
                        return x - 2 + getHeight(objNum, settings, tset);
                    }
                    else if (objNum === 0x3B) {
                        const a = (settings >>> 4) & 0b1111;
                        const b = (settings >>> 0) & 0b1111;
                        return x + 1 + a + b;
                    }
                }
                else if (tset === 3) {
                    if (objNum === 0x3c) {
                        const type = (settings >>> 4) & 0b1111;
                        const height = ((settings >>> 0) & 0b1111) + 1;
                        if (type === 0) {
                            const width = getWidth(objNum, settings, tset);
                            return x - 1 + width;
                        }
                    }
                    else if (objNum === 0x39) {
                        const type = (settings >>> 0) & 0b1111;
                        const width = getWidth(objNum, settings, tset);
                        if (type === 0) {
                            return x - 2 + width;
                        }
                        else if (type === 1) {
                            return x - 1 + width;
                        }
                    }
                    else if (objNum === 0x37) {
                        return 0;
                    }
                }
                else if (tset === 1) {
                    // castle
                    if (objNum === 0x3D) {
                        // escalator
                        let type;
                        type = (settings >>> 0) & 0b1111;
                        if (type === 0 || type === 1) {
                            return x - 1 + getWidth(objNum, settings, tset);
                        }
                    }
                }
                else if (tset === 2) {
                    // athletic
                    if (objNum === 0x37) {
                        const type = (settings >>> 0) & 0b1111;
                        if (type === 0) {
                            return x - 1 + getWidth(objNum, settings, tset);
                        }
                        else if (type === 1) {
                            return x - 1 + getWidth(objNum, settings, tset);
                        }
                    }
                    else if (objNum === 0x3B) {
                        const type = (settings >>> 4) & 0b1111;
                        if (type === 0) {
                            return (x - 1) + getWidth(objNum, settings, tset);
                        }
                    }
                    else if (objNum === 0x3a) {
                        const type = (settings) & 0b1111;
                        const width = getWidth(objNum, settings, tset);
                        if (type === 0) {
                            return x - 2 + width;
                        }
                        else if (type === 1) {
                            return x - 1 + width;
                        }
                        else if (type === 4) {
                            return x - 1 + width;
                        }
                    }
                }
                return x;
            }
            break;
    }
    return x;
}
function expand(data, size, extended, format, mirror, header = true) {
    let romData;
    // strip header
    if (header) {
        romData = new Array(data.length - 0x200);
        for (let i = 0; i < romData.length; i++) {
            romData[i] = data[i + 0x200];
        }
    }
    else {
        romData = Array.prototype.slice.call(data);
    }
    const type = detectRomType(romData, false);
    switch (type) {
        case "LoROM1":
        case "LoROM2":
        case "HiROM":
        case "ExLoROM":
        case "ExHiROM":
            break;
        default:
            throw new TypeError();
    }
    let romSize = romData.length;
    if (size <= romSize) {
        throw new TypeError();
    }
    // zero fill extend
    let resultData = new Array();
    for (let i = 0; i < romData.length; i++) {
        resultData[i] = romData[i];
    }
    for (let i = romData.length; i < size; i++) {
        resultData[i] = 0;
    }
    let addr;
    // adjust rom type header
    switch (type) {
        case "LoROM1":
        case "LoROM2":
        case "ExLoROM":
            addr = 0x7FD5;
            break;
        case "HiROM":
        case "ExHiROM":
            addr = 0xFFD5;
            break;
        default:
            throw new TypeError();
    }
    let newByte = romData[addr] & 0xF0;
    let currentMapType = romData[addr] & 0xF;
    switch (currentMapType) {
        case 0x1: // hirom
            if (extended) {
                newByte = newByte | 0x5;
            }
            else {
                newByte = newByte | 0x1;
            }
            break;
        default:
            newByte = newByte | currentMapType;
            break;
    }
    resultData[addr] = newByte;
    // adjust rom size header
    switch (type) {
        case "LoROM1":
        case "LoROM2":
        case "ExLoROM":
            addr = 0x7FD7;
            break;
        case "HiROM":
        case "ExHiROM":
            addr = 0xFFD7;
            break;
    }
    if (resultData.length > 0x400000) {
        resultData[addr] = 0xD;
    }
    else if (resultData.length > 0x200000) {
        resultData[addr] = 0xC;
    }
    else if (resultData.length > 0x100000) {
        resultData[addr] = 0xB;
    }
    else if (resultData.length > 0x80000) {
        resultData[addr] = 0xA;
    }
    else if (resultData.length > 0x40000) {
        resultData[addr] = 0x9;
    }
    else if (resultData.length > 0x20000) {
        resultData[addr] = 0x8;
    }
    else if (resultData.length > 0x10000) {
        resultData[addr] = 0x7;
    }
    else {
        throw new TypeError();
    }
    // exhirom or exlorom
    if (extended) {
        if (mirror == false) {
            switch (type) {
                case "ExHiROM":
                    // does nothing
                    break;
                case "ExLoROM":
                    // does nothing
                    break;
                case "LoROM1":
                    if (format == "ExLoROM") {
                        resultData = resultData.copyWithin(0x400000, 0x0, 0x400000);
                        for (let i = 0x8000; i <= 0x400000 - 1; i++) {
                            resultData[i] = 0;
                        }
                    }
                    else {
                        // LoROM1 to ExHiROM
                        if (romSize > 1048576) {
                            throw new TypeError();
                            return;
                        }
                        throw new TypeError();
                        return;
                    }
                    break;
                case "LoROM2":
                    resultData = resultData.copyWithin(0x400000, 0x0, 0x8000);
                    break;
                case "HiROM":
                    resultData = resultData.copyWithin(0x408000, 0x8000, 0x10000);
                    break;
                default:
                    throw new TypeError();
                    break;
            }
        }
        else {
            // mirror
            if (type == "HiROM" || type == "ExHiROM") {
                let pc = 0x408000;
                while (pc < resultData.length) {
                    let firstHalfLocation = pc - 0x400000;
                    resultData = resultData.copyWithin(pc, firstHalfLocation, firstHalfLocation + 0x8000);
                    pc += 0x10000;
                }
            }
            else if (type == "LoROM1" || type == "LoROM2" || type == "ExLoROM") {
                resultData = resultData.copyWithin(0x400000, 0x0, 0x400000);
            }
            else {
                throw new TypeError();
                return;
            }
        }
    }
    // recover smc header
    if (header) {
        let head = new Array(0x200);
        for (let i = 0; i < head.length; i++) {
            head[i] = 0;
        }
        head[0] = 0x40;
        resultData = head.concat(resultData);
    }
    return resultData;
}
function detectRomType(rom, header = true) {
    let pos = 0, posi;
    let temp, temp1, temp2;
    let ptr;
    let romData;
    // strip header
    if (header) {
        romData = new Array(rom.length - 0x200);
        for (let i = 0; i < romData.length; i++) {
            romData[i] = rom[i + 0x200];
        }
    }
    else {
        romData = rom;
    }
    if (romData.length < 0x10000) {
        return "Invalid";
    }
    pos = 0;
    posi = 0x7FDC;
    temp = romData[posi + pos];
    temp <<= 8;
    temp1 = (temp) | (romData[posi + (pos + 1)]);
    pos += 2;
    temp = romData[posi + pos];
    temp <<= 8;
    temp2 = (temp) | (romData[posi + (pos + 1)]);
    pos += 2;
    if ((temp1 ^ temp2) === 0xffff) {
        posi = 0x7FD5;
        ptr = romData[posi];
    }
    else {
        posi = 0xffdc;
        pos = 0;
        temp = romData[posi + pos];
        temp <<= 8;
        temp1 = (temp) | (romData[posi + (pos + 1)]);
        pos += 2;
        temp = romData[posi + pos];
        temp <<= 8;
        temp2 = (temp) | (romData[posi + (pos + 1)]);
        pos += 2;
        if ((temp1 ^ temp2) != 0xFFFF) {
            return "Invalid";
        }
        posi = 0xFFD5;
        ptr = romData[posi];
    }
    if ((ptr & 0xf) == 5) {
        return "ExHiROM";
    }
    else if ((ptr & 0xf) == 3) {
        return "HiROM";
    }
    else if ((ptr & 1) == 1) {
        if (romData.length <= 0x400000) {
            return "HiROM";
        }
        else {
            return "ExHiROM";
        }
    }
    else if (romData.length <= 0x400000) {
        if ((ptr >> 4) >= 3) {
            return "LoROM2";
        }
        else {
            return "LoROM1";
        }
    }
    else {
        return "ExLoROM";
    }
}
function pc2snes4lorom1(pc, header = true) {
    if (header && pc < 0x200) {
        throw new TypeError();
    }
    let snes;
    if (header)
        pc -= 0x200;
    if (pc >= 0x400000) {
        throw new TypeError();
    }
    else {
        snes = pc << 1;
        snes = snes & 0x7f0000;
        snes = snes | ((pc | 0x8000) & 0xffff);
        if (pc > 0x380000) {
            snes += 0x800000;
        }
    }
    return snes;
}
function pc2snes4lorom2(pc, header = true) {
    if (header && pc < 0x200) {
        throw new TypeError();
    }
    let snes;
    if (header)
        pc -= 0x200;
    if (pc >= 0x400000) {
        throw new TypeError();
    }
    else {
        snes = pc << 1;
        snes = snes & 0x7f0000;
        snes = snes | ((pc | 0x8000) & 0xffff);
        snes += 0x800000;
        ;
    }
    return snes;
}
function pc2snes4hirom(pc, header = true) {
    if (header && pc < 0x200) {
        throw new TypeError("pc address is too small");
    }
    let snes;
    if (header)
        pc -= 0x200;
    if (pc >= 0x400000) {
        throw new TypeError("pc address is too big");
    }
    else {
        snes = pc | 0xC00000;
    }
    return snes;
}
function pc2snes4exlorom(pc, header = true) {
    if (header && pc < 0x200) {
        throw new TypeError();
    }
    let snes;
    if (header)
        pc -= 0x200;
    if (pc >= 0x7F0000) {
        throw new TypeError();
    }
    else {
        snes = pc << 1;
        snes = snes & 0x7F0000;
        snes = snes | ((pc | 0x8000) & 0xFFFF);
        if (snes < 0x400000) {
            snes += 0x800000;
        }
    }
    return snes;
}
function pc2snes4exhirom(pc, header = true) {
    if (header && pc < 0x200) {
        throw new TypeError();
    }
    let snes;
    if (header)
        pc -= 0x200;
    if (pc >= 0x7E0000) {
        throw new TypeError();
    }
    else {
        snes = pc;
        if (pc < 0x400000) {
            snes = snes | 0xc00000;
        }
        if (pc >= 0x7e0000) {
            snes -= 0x400000;
        }
    }
    return snes;
}
function pc2snes4ram(pc, header = true) {
    if (header && pc < 0x200) {
        throw new TypeError();
    }
    let snes;
    if (pc < 0xc13 || pc >= 0x20c13) {
        throw new TypeError();
    }
    else {
        snes = pc - 0xC13 + 0x7E0000;
    }
    return snes;
}
function pc2snes4vram(pc, header = true) {
    if (header && pc < 0x200) {
        throw new TypeError();
    }
    let snes;
    if (pc >= 0x20c13 && pc < 0x30c13) {
        throw new TypeError();
    }
    else {
        snes = pc - 0x20C13;
        snes = snes >> 1;
    }
    return snes;
}
function pc2snes(pc, type = "Auto", header = true) {
    if (type === "Auto") {
        type = romType;
    }
    switch (type) {
        case "LoROM1":
            return pc2snes4lorom1(pc, header);
            break;
        case "LoROM2":
            return pc2snes4lorom2(pc, header);
            break;
        case "HiROM":
            return pc2snes4hirom(pc, header);
            break;
        case "ExLoROM":
            return pc2snes4exlorom(pc, header);
            break;
        case "ExHiROM":
            return pc2snes4exhirom(pc, header);
            break;
        case "RAM":
            return pc2snes4ram(pc, header);
            break;
        case "VRAM":
            return pc2snes4vram(pc, header);
            break;
        default:
            throw new TypeError();
    }
}
function snes2pc4exhirom(snes) {
    let pc = 0;
    if ((snes >= 0xC00000 && snes <= 0xFFFFFF) || (snes >= 0x400000 && snes <= 0x7DFFFF)) {
        pc = snes & 0x3FFFFF;
        if (snes < 0xC00000) {
            pc += 0x400000;
        }
    }
    else {
        throw new TypeError();
    }
    return pc;
}
function snes2pc4exlorom(snes) {
    let pc = 0;
    if ((snes >= 0x808000 && snes <= 0xFFFFFF) || (snes >= 0x008000 && snes <= 0x7dffff)) {
        pc = (snes & 0x7FFF | ((snes & 0x7F0000) >> 1));
        if (snes < 0x800000) {
            pc += 0x400000;
        }
    }
    else {
        throw new TypeError();
    }
    return pc;
}
function snes2pc4hirom(snes) {
    let pc = 0;
    if ((snes >= 0xC00000 && snes <= 0xFFFFFF)) {
        pc = (snes & 0x3FFFFF);
    }
    else {
        throw new TypeError();
    }
    return pc;
}
function snes2pc4lorom1(snes) {
    let pc = 0;
    if (snes >= 0x8000 && snes <= 0x6FFFFF) {
        pc = (snes & 0x7FFF | ((snes & 0x7F0000) >> 1));
    }
    else {
        throw new TypeError();
    }
    return pc;
}
function snes2pc4lorom2(snes) {
    let pc = 0;
    if (snes >= 0x808000 && snes <= 0xFFFFFF) {
        pc = (snes & 0x7FFF | ((snes & 0x7F0000) >> 1));
    }
    else {
        throw new TypeError();
    }
    return pc;
}
function snes2pc2(snes, type, header = true) {
    let result;
    let head;
    if (header) {
        head = 0x200;
    }
    else {
        head = 0;
    }
    switch (type) {
        case "LoROM1":
            result = snes2pc4lorom1(snes);
            break;
        case "LoROM2":
            result = snes2pc4lorom2(snes);
            break;
        case "HiROM":
            result = snes2pc4hirom(snes);
            break;
        case "ExHiROM":
            result = snes2pc4exhirom(snes);
            break;
        case "ExLoROM":
            result = snes2pc4exlorom(snes);
            break;
        case "RAM":
            return snes2pc4ram(snes);
            break;
        case "VRAM":
            return snes2pc4vram(snes);
            break;
        default:
            throw new TypeError();
    }
    result += head;
    return result;
}
function snes2pc4ram(snes) {
    let pc;
    if (snes >= 0x7E0000 && snes <= 0x7FFFFF) {
        pc = (0x1FFFF & snes) + 0xC13;
    }
    else {
        throw new TypeError();
    }
    return pc;
}
function snes2pc4vram(snes) {
    let pc;
    if (snes >= 0 && snes < 0x8000) {
        pc = (snes << 1) + 0x20c13;
    }
    else {
        throw new TypeError();
    }
    return pc;
}
function decompress_lz2(data) {
    /* graphics decompression algorithm */
    let i;
    let len;
    let output = new Array();
    let pointer = 0;
    let address = 0;
    let debugOutput = "";
    while (true) {
        if (data[pointer] === 0xFF) {
            break;
        }
        if (output.length > 65536) {
            throw new TypeError("Overflow");
        }
        switch ((data[pointer] >>> 5) & 0b111) {
            case 0b001:
                // byte fill
                debugOutput = "";
                len = (data[pointer] & 0b11111) + 1;
                for (i = 0; i < len; i++) {
                    output.push(data[pointer + 1]);
                    debugOutput += hex(data[pointer + 1]) + " ";
                }
                //log("(Byte-Fill Length: " + len + ")");
                //log(debugOutput);
                pointer += 2;
                break;
            case 0b011:
                // increasing fill
                debugOutput = "";
                len = (data[pointer] & 0b11111) + 1;
                for (i = 0; i < len; i++) {
                    output.push((data[pointer + 1] + i) & 0xFF);
                    debugOutput += hex((data[pointer + 1] + i) & 0xFF) + " ";
                }
                //log("(Increasing-Fill Length: " + len + ")");
                //log(debugOutput);
                pointer += 2;
                break;
            case 0b000:
                // direct copy
                debugOutput = "";
                len = (data[pointer] & 0b11111) + 1;
                for (i = 0; i < len; i++) {
                    output.push((data[pointer + 1 + i]));
                    debugOutput += hex((data[pointer + 1 + i])) + " ";
                }
                //log("(Direct-Copy Length: " + len + ")");
                //log(debugOutput);
                pointer += len + 1;
                break;
            case 0b010:
                // word fill
                debugOutput = "";
                len = (data[pointer] & 0b11111) + 1;
                for (i = 0; i < len; i++) {
                    if (i % 2 === 0) {
                        output.push(data[pointer + 1]);
                        debugOutput += hex(data[pointer + 1]) + " ";
                    }
                    else {
                        output.push(data[pointer + 2]);
                        debugOutput += hex(data[pointer + 2]) + " ";
                    }
                }
                //log("(Word-Fill Length: " + len + ")");
                //log(debugOutput);
                pointer += 3;
                break;
            case 0b100:
                // repeat
                debugOutput = "";
                len = (data[pointer] & 0b11111) + 1;
                address = (data[pointer + 1] << 8) | (data[pointer + 2]);
                for (i = 0; i < len; i++) {
                    output.push(output[address + i]);
                    debugOutput += hex(output[address + i]) + " ";
                }
                //log("(Repeat Length: " + len + ")");
                //log(debugOutput);
                pointer += 3;
                break;
            case 0b111:
                switch ((data[pointer] >>> 2) & 0b111) {
                    case 0b001:
                        // byte fill
                        debugOutput = "";
                        len = (((data[pointer] & 0b11) << 8) | data[pointer + 1]) + 1;
                        for (i = 0; i < len; i++) {
                            output.push(data[pointer + 2]);
                            debugOutput += hex(data[pointer + 2]) + " ";
                        }
                        //log("(Byte-Fill-Long Length: " + len + ")");
                        //log(debugOutput);
                        pointer += 3;
                        break;
                    case 0b011:
                        // increasing fill
                        debugOutput = "";
                        len = (((data[pointer] & 0b11) << 8) | data[pointer + 1]) + 1;
                        for (i = 0; i < len; i++) {
                            output.push((data[pointer + 2] + i) & 0xFF);
                            debugOutput += hex((data[pointer + 2] + i) & 0xFF) + " ";
                        }
                        //log("(Increasing-Fill-Long Length: " + len + ")");
                        //log(debugOutput);
                        pointer += 3;
                        break;
                    case 0b000:
                        // direct copy
                        debugOutput = "";
                        len = (((data[pointer] & 0b11) << 8) | data[pointer + 1]) + 1;
                        for (i = 0; i < len; i++) {
                            output.push(data[pointer + 2 + i]);
                            debugOutput += hex(data[pointer + 2 + i]) + " ";
                        }
                        //log("(Direct-Copy-Long Length: " + len + ")");
                        //log(debugOutput);                       
                        pointer += len + 2;
                        break;
                    case 0b100:
                        // repeat
                        debugOutput = "";
                        len = (((data[pointer] & 0b11) << 8) | data[pointer + 1]) + 1;
                        address = (data[pointer + 2] << 8) | (data[pointer + 3]);
                        for (i = 0; i < len; i++) {
                            output.push(output[address + i]);
                            debugOutput += hex(output[address + i]) + " ";
                        }
                        //log("(Repeat-Long Length: " + len + ")");
                        //log(debugOutput);                         
                        pointer += 4;
                        break;
                    case 0b010:
                        // word fill
                        debugOutput = "";
                        len = (((data[pointer] & 0b11) << 8) | data[pointer + 1]) + 1;
                        for (i = 0; i < len; i++) {
                            if (len % 2 === 0) {
                                output.push(data[pointer + 2]);
                                debugOutput += hex(data[pointer + 2]) + " ";
                            }
                            else {
                                output.push(data[pointer + 3]);
                                debugOutput += hex(data[pointer + 3]) + " ";
                            }
                        }
                        //log("(Word-Fill-Long Length: " + len + ")");
                        //log(debugOutput);      
                        pointer += 4;
                        break;
                    default:
                        throw new Error('unknown long command 0b' + (data[pointer] >>> 5).toString(2));
                }
                break;
            default:
                throw new Error('unknown command 0b' + (data[pointer] >>> 5).toString(2));
        }
    }
    return output;
}
function unload() {
    location.reload();
}
function hex(val, length = 2) {
    let result;
    let j;
    if (val === undefined)
        debugger;
    result = val.toString(16).toUpperCase();
    j = length - result.length;
    for (let i = 0; i < j; i++) {
        result = '0' + result;
    }
    return result;
}
function setPoint(top, left, r, g, b, ctx, alpha = 1.0) {
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
    ctx.fillRect(left, top, 1, 1);
}
function intdiv(a, b) {
    return Math.floor(a / b);
}
function stripHeader(romData) {
    let result = Array.prototype.slice.call(romData);
    result.splice(0, 0x200);
    return result;
}
function compress_rle1(data) {
    let i, j;
    let output = [];
    let buffer = [];
    let byteCount = 1;
    let isDirect = false;
    let directLength = 0;
    let debugOutput = "";
    for (i = 0; i < data.length; i++) {
        byteCount = 1;
        // rle
        for (j = i; j < data.length - 1; j++) {
            if (data[j] !== data[j + 1]) {
                break;
            }
            byteCount++;
        }
        if (byteCount - 1 > 127) {
            byteCount = 127;
        }
        if (byteCount - 1 === 127 && data[i] === 0xFF) {
            byteCount--;
        }
        if (byteCount > 2) {
            if (isDirect) {
                isDirect = false;
                log("(Direct-Copy Length: " + directLength + ")");
                debugOutput = "";
                for (j = 0; j < buffer.length; j++) {
                    debugOutput += hex(buffer[j]) + " ";
                }
                output.push(directLength - 1);
                output = output.concat(buffer);
                log(debugOutput);
            }
            log("(Byte-Fill Length: " + byteCount + ")");
            debugOutput = "";
            output.push(0b10000000 | ((byteCount - 1) & 0b01111111));
            output.push(data[i]);
            for (j = 0; j < byteCount; j++) {
                debugOutput += hex(data[i]) + " ";
            }
            log(debugOutput);
            i += byteCount - 1;
        }
        else {
            if (isDirect) {
                if (directLength > 0b01111111) {
                    isDirect = false;
                    log("(Direct-Copy Length: " + (0b01111111 + 1) + ")");
                    output.push(0b01111111);
                    output = output.concat(buffer);
                    debugOutput = "";
                    for (j = 0; j < buffer.length; j++) {
                        debugOutput += hex(buffer[j]) + " ";
                    }
                    log(debugOutput);
                    directLength = 1;
                    buffer = [];
                    buffer.push(data[i]);
                    isDirect = true;
                    continue;
                }
                else {
                    directLength++;
                    buffer.push(data[i]);
                }
            }
            else {
                directLength = 1;
                buffer = [];
                buffer.push(data[i]);
                isDirect = true;
            }
        }
    }
    if (isDirect) {
        isDirect = false;
        log("(Direct-Copy Length: " + directLength + ")");
        debugOutput = "";
        for (j = 0; j < buffer.length; j++) {
            debugOutput += hex(buffer[j]) + " ";
        }
        output.push(directLength - 1);
        output = output.concat(buffer);
        log(debugOutput);
    }
    output.push(0xFF);
    output.push(0xFF);
    return output;
}
function arrayCompare(a, b) {
    let aLen = a.length;
    let bLen = b.length;
    if (aLen != bLen) {
        return false;
    }
    for (let i = 0; i < aLen; i++) {
        if (a[i] !== b[i]) {
            return false;
        }
    }
    return true;
}
function log(msg) {
    console.log(msg);
}
function snes2pc(snes, type = "Auto", header = true) {
    return snes2pc1(snes, type, header);
}
function snes2pc1(snes, type = "Auto", header = true) {
    let result;
    let head;
    if (header) {
        head = 0x200;
    }
    else {
        head = 0;
    }
    if (type === "Auto") {
        type = romType;
    }
    switch (type) {
        case "LoROM1":
        case "LoROM2":
            result = head + ((snes & 0x7FFF) | ((snes >>> 1) & 0x3F8000));
            break;
        case "HiROM":
            result = head + (snes & 0x3FFFFF);
            break;
        case "ExHiROM":
            //result = snes2pc4exhirom(snes);
            result = (snes & 0x3FFFFF) + head + ((snes < 0x800000 ? 0x400000 : 0));
            break;
        case "ExLoROM":
            result = head + ((snes & 0x7FFF) | ((snes >>> 1) & 0x3F8000)) + (snes < 0x800000 ? 0x400000 : 0);
            break;
        default:
            throw new TypeError();
    }
    return result;
}
function safeParseInt(str) {
    // must return 32 bit integer
    let result = parseInt(str);
    if (!isFinite(result))
        throw new TypeError();
    result = result | 0;
    return result;
}
function decompress_rle1(data) {
    let i, j;
    let length;
    let output = new Array();
    let outputBuffer = "";
    for (i = 0; i < data.length; i++) {
        if (i + 1 < data.length && data[i] === 0xFF && data[i + 1] === 0xFF) {
            break;
        }
        if (outputBuffer.length > 65536)
            break;
        switch (data[i] >> 7) {
            case 0:
                // direct copy
                length = (data[i] & 0b1111111) + 1;
                //log("(Direct-Copy Length: " + length + ")");
                outputBuffer = "";
                for (j = 0; j < length; j++) {
                    output.push(data[i + 1 + j]);
                    outputBuffer += hex(data[i + 1 + j]) + " ";
                }
                //log(outputBuffer);
                i += length;
                break;
            case 1:
                // rle
                length = (data[i] & 0b1111111) + 1;
                //log("(Byte-Copy Length: " + length + ")");
                outputBuffer = "";
                for (j = 0; j < length; j++) {
                    output.push(data[i + 1]);
                    outputBuffer += hex(data[i + 1]) + " ";
                }
                //log(outputBuffer);
                i += 1;
                break;
            default:
                throw new TypeError("unknown command");
        }
    }
    return output;
}
function read3(address) {
    const addr = snes2pc(address);
    if (addr >= fileData.length) {
        throw new Error("pointer is bigger than rom");
    }
    return ((fileData[snes2pc(address + 2)] << 16) | (((((fileData[snes2pc(address + 1)] << 8) | fileData[snes2pc(address + 0)])))));
}
function read2(address) {
    const addr = snes2pc(address);
    if (addr >= fileData.length) {
        throw new Error("pointer is bigger than rom");
    }
    return ((((((fileData[snes2pc(address + 1)] << 8) | fileData[snes2pc(address + 0)])))));
}
function read1(address) {
    const addr = snes2pc(address);
    if (addr >= fileData.length) {
        throw new Error("pointer is bigger than rom");
    }
    return fileData[addr + 0];
}
function applyIpsPatch(target, ips) {
    const result = Array.prototype.slice.call(target);
    let header = "";
    let eof = "";
    let loc = 0;
    let len = 0;
    for (let i = 0; i < 5; i++) {
        header += String.fromCharCode(ips[i]);
    }
    if (header !== "PATCH") {
        throw new Error(header);
    }
    for (let i = 5; i < ips.length; i++) {
        if (i + 2 < ips.length) {
            eof = String.fromCharCode(ips[i + 0], ips[i + 1], ips[i + 2]);
            if (eof === "EOF") {
                console.log("EOF");
                return result;
            }
        }
        else {
            throw new Error();
        }
        if (i + 2 < ips.length) {
            loc = (ips[i + 0] << 16) | (ips[i + 1] << 8) | (ips[i + 2] << 0);
            if (i + 4 < ips.length) {
                len = (ips[i + 3] << 8) | (ips[i + 4] << 0);
            }
            else {
                throw new Error();
            }
            if (len === 0) {
                // RLE
                if (i + 7 < ips.length) {
                    const len2 = (ips[i + 5] << 8) | (ips[i + 6] << 0);
                    const value = ips[i + 7];
                    console.log("RLE: Count=" + len2.toString(16) + ", Value=" + value.toString(16));
                    for (let j = 0; j < len2; j++) {
                        if (loc + j >= result.length) {
                            for (let k = result.length; k <= loc + j; k++) {
                                result[k] = 0;
                            }
                        }
                        result[loc + j] = value;
                    }
                    i += 7;
                    continue;
                }
                else {
                    throw new Error();
                }
            }
            else {
                // direct copy
                let log = "Direct copy: Location=" + loc.toString(16) + ", Length=" + len.toString(16);
                log += ", Range=[";
                log += (i).toString(16) + ", " + (i + 4 + len).toString(16) + "]";
                console.log(log);
                for (let j = 0; j < len; j++) {
                    let value = ips[i + 5 + j];
                    if (loc + j >= result.length) {
                        for (let k = result.length; k <= loc + j; k++) {
                            result[k] = 0;
                        }
                    }
                    result[loc + j] = value;
                }
                i += 4 + len;
                continue;
            }
        }
        else {
            throw new Error();
        }
    }
    throw new Error();
}
function write8(val, buf) {
    let buflen = buf.length;
    buf[buflen++] = val & 0xFF;
    return buflen;
}
function write16(val, buf) {
    write8((val) >> 8, buf);
    write8((val), buf);
}
function write24(val, buf) {
    write8((val) >> 16, buf);
    write8((val) >> 8, buf);
    write8((val), buf);
}
function ips_create(source, target) {
    "use strict";
    const sourcelen = source.length;
    const targetlen = target.length;
    if (targetlen > 16777216) {
        throw new Error();
    }
    if (targetlen >= 16777216 && sourcelen > targetlen) {
        throw new Error();
    }
    let offset = 0;
    let outbuflen = 4096;
    let out = new Array();
    let outlen = 0;
    write8('P'.charCodeAt(0), out);
    write8('A'.charCodeAt(0), out);
    write8('T'.charCodeAt(0), out);
    write8('C'.charCodeAt(0), out);
    write8('H'.charCodeAt(0), out);
    let lastknownchange = 0;
    while (offset < targetlen) {
        while (offset < sourcelen && (offset < sourcelen ? source[offset] : 0) === target[offset]) {
            offset++;
        }
        let thislen = 0;
        let consecutiveunchanged = 0;
        thislen = lastknownchange - offset;
        if (thislen < 0) {
            thislen = 0;
        }
        while (true) {
            let thisbyte = offset + thislen + consecutiveunchanged;
            if (thisbyte < sourcelen && (thisbyte < sourcelen ? source[thisbyte] : 0) === target[thisbyte]) {
                consecutiveunchanged++;
            }
            else {
                thislen += consecutiveunchanged + 1;
                consecutiveunchanged = 0;
            }
            if (consecutiveunchanged >= 6 || thislen >= 65536) {
                break;
            }
        }
        //avoid premature EOF
        if (offset == 0x454F46) {
            offset--;
            thislen++;
        }
        lastknownchange = offset + thislen;
        if (thislen > 65535)
            thislen = 65535;
        if (offset + thislen > targetlen)
            thislen = targetlen - offset;
        if (offset == targetlen)
            continue;
        //check if RLE here is worthwhile
        let byteshere;
        for (byteshere = 0; byteshere < thislen && target[offset] == target[offset + byteshere]; byteshere++) { }
        if (byteshere == thislen) {
            let thisbyte = target[offset];
            let i = 0;
            while (true) {
                let pos = offset + byteshere + i - 1;
                if (pos >= targetlen || target[pos] != thisbyte || byteshere + i > 65535)
                    break;
                if (pos >= sourcelen || (pos < sourcelen ? source[pos] : 0) != thisbyte) {
                    byteshere += i;
                    thislen += i;
                    i = 0;
                }
                i++;
            }
        }
        if ((byteshere > 8 - 5 && byteshere == thislen) || byteshere > 8) {
            write24(offset, out);
            write16(0, out);
            write16(byteshere, out);
            write8(target[offset], out);
            offset += byteshere;
        }
        else {
            //check if we'd gain anything from ending the block early and switching to RLE
            let byteshere = 0;
            let stopat = 0;
            while (stopat + byteshere < thislen) {
                if (target[offset + stopat] == target[offset + stopat + byteshere]) {
                    byteshere++;
                }
                else {
                    stopat += byteshere;
                    byteshere = 0;
                }
                if (byteshere > 8 + 5 || //rle-worthy despite two ips headers
                    (byteshere > 8 && stopat + byteshere == thislen) || //rle-worthy at end of data
                    (byteshere > 8 && !memcmp(target.slice(offset + stopat + byteshere), //rle-worthy before another rle-worthy
                    target.slice(offset + stopat + byteshere + 1), 9 - 1))) {
                    if (stopat)
                        thislen = stopat;
                    break; //we don't scan the entire block if we know we'll want to RLE, that'd gain nothing.
                }
            }
            //don't write unchanged bytes at the end of a block if we want to RLE the next couple of bytes
            if (offset + thislen != targetlen) {
                while (offset + thislen - 1 < sourcelen &&
                    target[offset + thislen - 1] == (offset + thislen - 1 < sourcelen ? source[offset + thislen - 1] : 0)) {
                    thislen--;
                }
            }
            if (thislen > 3 && !memcmp(target.slice(offset), target.slice(offset + 1), thislen - 1)) //still worth it?
             {
                write24(offset, out);
                write16(0, out);
                write16(thislen, out);
                write8(target[offset], out);
            }
            else {
                write24(offset, out);
                write16(thislen, out);
                let i;
                for (i = 0; i < thislen; i++)
                    write8(target[offset + i], out);
            }
            offset += thislen;
        }
    }
    write8('E'.charCodeAt(0), out);
    write8('O'.charCodeAt(0), out);
    write8('F'.charCodeAt(0), out);
    if (sourcelen > targetlen)
        write24(targetlen, out);
    if (out.length === 8) {
        return out;
    }
    return out;
}
function memcmp(arr1, arr2, n) {
    const limit = Math.min(n, arr1.length, arr2.length);
    for (let i = 0; i < limit; i++) {
        if (arr1[i] !== arr2[i]) {
            return arr1[i] < arr2[i] ? -1 : 1;
        }
    }
    return 0;
}
function compress_lz2(data) {
    let i, j;
    let output = [];
    let buffer = [];
    let directLength = 0;
    let debugOutput = "";
    let isDirect = false;
    let bestOffset, bestLength;
    let byteCount, incCount, wordCount;
    if (data.length > 65536) {
        throw new TypeError("Data is too big.");
    }
    for (i = 0; i < data.length; i++) {
        byteCount = 1;
        incCount = 1;
        wordCount = 2;
        bestOffset = 0;
        bestLength = 0;
        // byte fill
        for (j = i; j < data.length - 1; j += 1) {
            if (data[j] !== data[j + 1]) {
                break;
            }
            byteCount++;
        }
        // increasing fill
        for (j = i; j < data.length - 1; j++) {
            if (((data[j] + 1) & 0xFF) === data[j + 1]) {
                incCount++;
            }
            else {
                break;
            }
        }
        // word fill
        for (j = i; j < data.length; j++) {
            if (j + 2 < data.length && data[j] === data[j + 2]) {
                if (j + 3 < data.length && data[j + 1] === data[j + 3]) {
                    wordCount += 2;
                    j += 1;
                }
                else {
                    wordCount++;
                    break;
                }
            }
            else {
                break;
            }
        }
        // repeat
        let max = Math.min(i, 0x10000);
        for (j = 0; j < max; j++) {
            let l = 0;
            while (true) {
                if (l >= 0x400 || i + l >= data.length || data[j + l] !== data[i + l]) {
                    break;
                }
                l++;
            }
            if (l > bestLength) {
                bestLength = l;
                bestOffset = j;
            }
        }
        if (((bestLength >= 4)) &&
            (!(isDirect && directLength > 32 && bestLength == 4)) &&
            (bestLength > byteCount && bestLength > wordCount && bestLength > incCount)) {
            if (isDirect) {
                isDirect = false;
                if (directLength > 32) {
                    output.push(0b11100000 | (((directLength - 1) >>> 8) & 0b11));
                    output.push((directLength - 1) & 0xFF);
                    log("(Direct-Copy-Long Length: " + directLength + ")");
                }
                else {
                    output.push(directLength - 1);
                    log("(Direct-Copy Length: " + directLength + ")");
                }
                output = output.concat(buffer);
                log(debugOutput);
                debugOutput = "";
            }
            if (bestLength > 32) {
                if (bestLength - 1 > 0b1111111111) {
                    output.push(0b11110011);
                    output.push(0xFF);
                    output.push((bestOffset >> 8) & 0xFF);
                    output.push((bestOffset) & 0xFF);
                    log("(Repeat-Long Length: 1024)");
                    debugOutput = bestOffset + "";
                    log(debugOutput);
                    i += 0b1111111111;
                    continue;
                }
                else {
                    output.push(0b11110000 | (((bestLength - 1) >>> 8) & 0b11));
                    output.push((bestLength - 1) & 0xFF);
                    output.push((bestOffset >> 8) & 0xFF);
                    output.push((bestOffset) & 0xFF);
                    log("(Repeat-Long Length: " + bestLength + ")");
                }
            }
            else {
                output.push(0b10000000 | (bestLength - 1));
                output.push((bestOffset >> 8) & 0xFF);
                output.push((bestOffset) & 0xFF);
                log("(Repeat Length: " + bestLength + ")");
            }
            debugOutput = bestOffset + "";
            log(debugOutput);
            i += bestLength - 1;
        }
        else if ((byteCount >= 3) &&
            (!(isDirect && directLength > 32 && byteCount == 3))) {
            if (isDirect) {
                isDirect = false;
                if (directLength > 32) {
                    output.push(0b11100000 | (((directLength - 1) >>> 8) & 0b11));
                    output.push((directLength - 1) & 0xFF);
                    log("(Direct-Copy-Long Length: " + directLength + ")");
                }
                else {
                    output.push(directLength - 1);
                    log("(Direct-Copy Length: " + directLength + ")");
                }
                output = output.concat(buffer);
                log(debugOutput);
                debugOutput = "";
            }
            if (byteCount > 32) {
                if (byteCount - 1 > 0b1111111111) {
                    output.push(0b11100111);
                    output.push(0xFF);
                    output.push(data[i]);
                    log("(Byte-Fill-Long Length: " + (0b1111111111 + 1) + ")");
                    debugOutput = "";
                    for (j = 0; j < 0b1111111111 + 1; j++) {
                        debugOutput += data[i] + ", ";
                    }
                    log(debugOutput);
                    i += 0b1111111111;
                    continue;
                }
                else {
                    output.push(0b11100100 | (((byteCount - 1) >>> 8) & 0b11));
                    output.push((byteCount - 1) & 0xFF);
                    output.push(data[i]);
                }
            }
            else {
                output.push(0b00100000 | (byteCount - 1));
                output.push(data[i]);
            }
            log("(Byte-Fill Length: " + byteCount + ")");
            debugOutput = "";
            for (j = 0; j < byteCount; j++) {
                debugOutput += data[i] + ", ";
            }
            log(debugOutput);
            i += byteCount - 1;
        }
        else if ((incCount >= 3) &&
            (!(isDirect && directLength > 32 && incCount == 3))) {
            if (isDirect) {
                isDirect = false;
                if (directLength > 32) {
                    output.push(0b11100000 | (((directLength - 1) >>> 8) & 0b11));
                    output.push((directLength - 1) & 0xFF);
                    log("(Direct-Copy-Long Length: " + directLength + ")");
                }
                else {
                    output.push(directLength - 1);
                    log("(Direct-Copy Length: " + directLength + ")");
                }
                output = output.concat(buffer);
                log(debugOutput);
                debugOutput = "";
            }
            if (incCount > 32) {
                if (incCount - 1 > 0b1111111111) {
                    output.push(0b11101111);
                    output.push(0xFF);
                    output.push(data[i]);
                    log("(Increasing-Fill-Long Length: " + (0b1111111111 + 1) + ")");
                    debugOutput = "";
                    for (j = 0; j < 0b1111111111 + 1; j++) {
                        debugOutput += ((data[i] + j) & 0xFF) + ", ";
                    }
                    log(debugOutput);
                    i += 0b1111111111;
                    continue;
                }
                output.push(0b11101100 | (((incCount - 1) >>> 8) & 0b11));
                output.push((incCount - 1) & 0xFF);
                output.push(data[i]);
            }
            else {
                output.push(0b01100000 | (incCount - 1));
                output.push(data[i]);
            }
            log("(Increasing-Fill Length: " + incCount + ")");
            debugOutput = "";
            for (j = 0; j < incCount; j++) {
                debugOutput += ((data[i] + j) & 0xFF) + ", ";
            }
            log(debugOutput);
            i += incCount - 1;
        }
        else if ((wordCount >= 4) &&
            (!(isDirect && directLength > 32 && wordCount == 4))) {
            if (isDirect) {
                isDirect = false;
                if (directLength > 32) {
                    output.push(0b11100000 | (((directLength - 1) >>> 8) & 0b11));
                    output.push((directLength - 1) & 0xFF);
                    log("(Direct-Copy-Long Length: " + directLength + ")");
                }
                else {
                    output.push(0b00000000 | (directLength - 1));
                    log("(Direct-Copy Length: " + directLength + ")");
                }
                output = output.concat(buffer);
                log(debugOutput);
                debugOutput = "";
            }
            if (wordCount > 32) {
                if (wordCount - 1 > 0b1111111111) {
                    output.push(0b11101011);
                    output.push(0xFF);
                    output.push(data[i]);
                    output.push(data[i + 1]);
                    log("(Word-Fill-Long Length: " + (0b1111111111 + 1) + ")");
                    debugOutput = "";
                    for (j = 0; j < 0b1111111111 + 1; j++) {
                        debugOutput += data[i] + j + ", ";
                    }
                    log(debugOutput);
                    i += 0b1111111111;
                    continue;
                }
                output.push(0b11101000 | (((wordCount - 1) >>> 8) & 0b11));
                output.push((wordCount - 1) & 0xFF);
            }
            else {
                output.push(0b01000000 | (wordCount - 1));
            }
            output.push(data[i]);
            output.push(data[i + 1]);
            log("(Word-Fill Length: " + wordCount + ")");
            debugOutput = "";
            for (j = 0; j < wordCount; j++) {
                if (j % 2 === 0) {
                    debugOutput += data[i] + ", ";
                }
                else {
                    debugOutput += data[i + 1] + ", ";
                }
            }
            log(debugOutput);
            i += wordCount - 1;
        }
        else {
            if (isDirect) {
                if (directLength > 0b1111111111) {
                    isDirect = false;
                    output.push(0b11100011);
                    output.push(0b11111111);
                    output = output.concat(buffer);
                    log("(Direct-Copy-Long Length: " + (0b1111111111 + 1) + ")");
                    log(debugOutput);
                    debugOutput = "";
                    directLength = 1;
                    buffer = [];
                    buffer.push(data[i]);
                    isDirect = true;
                    debugOutput = data[i] + " ";
                    continue;
                }
                else {
                    directLength++;
                    buffer.push(data[i]);
                    debugOutput += data[i] + " ";
                }
            }
            else {
                directLength = 1;
                buffer = [];
                buffer.push(data[i]);
                isDirect = true;
                debugOutput = data[i] + " ";
            }
        }
    }
    if (isDirect) {
        isDirect = false;
        if (directLength > 32) {
            output.push(0b11100000 | (((directLength - 1) >>> 8) & 0b11));
            output.push((directLength - 1) & 0xFF);
            log("(Direct-Copy-Long Length: " + directLength + ")");
        }
        else {
            output.push(directLength - 1);
            log("(Direct-Copy Length: " + directLength + ")");
        }
        output = output.concat(buffer);
        log(debugOutput);
        debugOutput = "";
    }
    output.push(0xFF);
    const test = decompress_lz2(new Uint8Array(output));
    if (!arrayCompare(data, test)) {
        throw new Error();
    }
    return output;
}
function checkRomFileSize(fileData, header = true) {
    // check the file size
    let headerSize = 0;
    if (header) {
        headerSize = 0x200;
    }
    switch (fileData.length) {
        case 524288 + headerSize:
        case 1048576 + headerSize:
        case 1572864 + headerSize:
        case 2097152 + headerSize:
        case 2621440 + headerSize:
        case 3145728 + headerSize:
        case 3670016 + headerSize:
        case 4194304 + headerSize:
        case 6291456 + headerSize:
        case 8388608 + headerSize:
            return true;
            break;
        default:
            throw new Error("Wrong File Size: " + fileData.length);
            return false;
            break;
    }
}
