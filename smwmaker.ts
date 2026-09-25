"use strict";

type Nullable<T> = null | T;

const layer1DatasTable: number = 0x05E000;
const layer2DatasTable: number = 0x05E600;
const spriteDataTable: number = 0x05EC00;
const spriteGfxTable: number = 0x00A8C3;
const tilesetList = [0, 1, 2, 3, 4, 4, 2, 0, 2, 3, 3, 3, 0, 4, 3];
const layer2List: any = {0: 0, 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 1, 8: 1, 9: 0, 
    0x0A: 0, 0x0B: 0, 0x0C: 0, 0x0D: 0, 0x0E: 0, 0x0F: 1, 0x10: 0, 0x11: 0, 0x12: 1,
    0x13: 1, 0x14: 1, 0x15: 1, 0x16: 1, 0x17: 1, 0x18: 1, 0x19: 1, 0x1A: 1, 0x1B: 1,
    0x1C: 1, 0x1D: 1, 0x1E: 0, 0x1F: 1};
const verticalList: any = {
    0: 0, 1: 0, 2: 0, 3: 1, 4: 1, 5: 0, 6: 0, 7: 1, 8: 1, 9: 0, 0x0A: 1, 0x0B: 0, 0x0C: 0, 0x0D: 1,
    0x0E: 0, 0x0F: 0, 0x10: 0, 0x11: 0, 0x12: 0, 0x13: 0, 0x14: 0, 0x15: 0, 0x16: 0, 0x17: 0, 0x18: 0,
    0x19: 0, 0x1A: 0, 0x1B: 0, 0x1C: 0, 0x1D: 0, 0x1E: 0, 0x1F: 0 
};
const defaultBGList = [0x0CD900, 0x0CDAB9, 0x0CDC71, 0x0CDD44, 0x0CDE54, 
    0x0CDF59, 0x0CE103, 0x0CE472, 0x0CE674, 0x0CE684, 0x0CE7C0, 0x0CE8EE, 
    0x0CE8FE, 0x0CEC82, 0x0CEF80, 0x0CF175, 0x0CF45A];

class TilePart {
    gfx: number = 0;
    xflip: number = 0;
    yflip: number = 0;
    prior: number = 0;
    pal: number = 0;
}

class Tile {
    upleft: TilePart;
    upright: TilePart;
    lowleft: TilePart;
    lowright: TilePart;

    constructor() {
        this.upleft = new TilePart();
        this.upright = new TilePart();
        this.lowleft = new TilePart();
        this.lowright = new TilePart();
    }
}

class RGB {
    r: number = 0;
    g: number = 0;
    b: number = 0;
}

class Obj {
    objNum: number = 0;
    x: number = 0;
    y: number = 0;
    settings: number = 0;
    screen: number = 0;
    tileNum: number = -1;
    tileWidth: number = 0;
    tileHeight: number = 0;
    extA: number = 0;
    extB: number = 0;

    constructor(objNum: number, x: number, y: number, settings: number) {
        this.objNum = objNum;
        this.x = x;
        this.y = y;
        this.settings = settings;
    }
}

class Sprite {
    xPosition: number = 0;
    yPosition: number = 0;
    spriteID: number = 0;
    extra: number = 0;
    screenNum: number = 0;
}

class Exit {
    scrNumber: number = 0;
    isSecond: number = 0;
    destLevel: number = 0;
    isWaterMid: number = 0;
    LMflag: number = 0;
}

class SecondExit {
    dest: number = 0;
    bg: number = 0;
    fg: number = 0;
    x: number = 0;
    y: number = 0;
    scrNum: number = 0;
    action: number = 0;
    modified: boolean = false;
}

let layer1Data: Obj[], layer2Data: Obj[];
let exits: Exit[];
let sprites: Sprite[];
let bgColor: RGB;
let bgData: Nullable<number[]>;
let map16: Tile[], bgTiles: Tile[];
let fg1bmp: number[][], fg2bmp: number[][], bgbmp: number[][], fg3bmp: number[][];
let sp1bmp: number[][], sp2bmp: number[][], sp3bmp: number[][], sp4bmp: number[][];
let fileData: Uint8Array;
let fileName: string = "";
let levelNum: number;
let layer1DataPointer: number;
let layer2DataPointer: number;
let spriteDataPointer: number;
let tileset: number;
let fgbgGFX: number, sprGFX: number;
let fg1: number, fg2: number, bg: number, fg3: number;
let sp1: number, sp2: number, sp3: number, sp4: number;
let isLMModified: boolean;
let bgPage: number;
let bgPalNum: number, fgPalNum: number, spPalNum: number;
let pal: RGB[][];
let editMode: string = "layer1";
let isVertical: boolean = false;
let timer: number;
let music: number;
let itemMemory: number;
let layer3Prior: number;
let verticalScrollSetting: number;
let buoyancy: number, buoyancy2: number;
let sprMemory: number;
let layer2ScrollSetting: number;
let layer3Setting: number;
let verticalLevelPositioning: number;
let verticalLevelUnknown: number;
let disableNoYoshi: number;
let enterScrNum: number, midScrNum: number;
let enterAction: number;
let enterX: number, enterY: number;
let enterFG: number, enterBG: number;
let levelMode: number;
let screenLength: number;
let backAreaColorNum: number;
let bgPointer: number;
let isLayer2: boolean;
let secondExits: SecondExit[];
let isBGEdited: boolean = false;
let lmVer: string;
let romType: string;
let bypassedMusic: number;
let isTimeBypassed: boolean;
let hundreds: number;
let tens: number;
let ones: number;
let resetTheTime: boolean;
let sprGFXindex: number;
let fgbgGFXindex: number;

let btnOpen: HTMLButtonElement
let btnPalette: HTMLButtonElement
let btn8x8: HTMLButtonElement
let btn16x16: HTMLButtonElement
let btnLevelToImage: HTMLButtonElement
let btnLevelHeader: HTMLButtonElement
let btnGFX: HTMLButtonElement;
let btnSprHeader: HTMLButtonElement
let btnOtherHeader: HTMLButtonElement;
let btnEnter: HTMLButtonElement;
let btnSwitchBG: HTMLButtonElement;
let btnBGCancel: HTMLButtonElement;
let btnBGOK: HTMLButtonElement;
let btnEnterOK: HTMLButtonElement;
let btnEnterCancel: HTMLButtonElement;
let btnSprHeaderOK: HTMLButtonElement;
let btnSprHeaderCancel: HTMLButtonElement;
let selBG: HTMLSelectElement;
let btnOtherHeaderOK: HTMLButtonElement;
let btnOtherHeaderCancel: HTMLButtonElement;
let btnPaletteOK: HTMLButtonElement;
let btnPaletteCancel: HTMLButtonElement;
let selBackColor: HTMLSelectElement;
let selFGColor: HTMLSelectElement;
let selBGColor: HTMLSelectElement;
let selSprColor: HTMLSelectElement;
let btnGFXOK: HTMLButtonElement;
let btnGFXCancel: HTMLButtonElement;
let main: HTMLDivElement;
let btnHeaderOK: HTMLButtonElement;
let btnHeaderCancel: HTMLButtonElement;
let btnExit: HTMLButtonElement;
let selScrNumber: HTMLSelectElement;
let btnExitOK: HTMLButtonElement;
let btnExitCancel: HTMLButtonElement;
let btnExitDelete: HTMLButtonElement;
let btn2ndExit: HTMLButtonElement;
let sel2ndEnter: HTMLSelectElement;
let btn2ndOK: HTMLButtonElement;
let btn2ndCancel: HTMLButtonElement;
let btnSave: HTMLButtonElement;

let isPress: boolean = false;
let prevPosX = 0, prevPosY = 0;
let target: Nullable<HTMLDivElement> = null;
let prevObjLeft: number, prevObjTop: number;

function save() {
    let low: number, high: number, bank: number;
    let primaryLevelHeader = [0, 0, 0, 0, 0];
    let secondaryLevelHeader = [0, 0, 0, 0];
    let spriteHeader = 0;

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
    secondaryLevelHeader[3] = ((((disableNoYoshi & 1) << 7) | ((verticalLevelUnknown & 1) << 6)) | ((verticalLevelPositioning & 1) << 5)) | (enterScrNum & 0b11111)

    // get old level data pointer

    low  = fileData[snes2pc(layer1DatasTable + (3 * levelNum) + 0)];
    high = fileData[snes2pc(layer1DatasTable + (3 * levelNum) + 1)];
    bank = fileData[snes2pc(layer1DatasTable + (3 * levelNum) + 2)];

    let oldLayer1DataPointer = (bank << 16) | (high << 8) | low;

    low  = fileData[snes2pc(layer2DatasTable + (3 * levelNum) + 0)];
    high = fileData[snes2pc(layer2DatasTable + (3 * levelNum) + 1)];
    bank = fileData[snes2pc(layer2DatasTable + (3 * levelNum) + 2)];

    let oldLayer2DataPointer = (bank << 16) | (high << 8) | low;

    low  = fileData[snes2pc(spriteDataTable + (2 * levelNum) + 0)];
    high = fileData[snes2pc(spriteDataTable + (2 * levelNum) + 1)];

    if (!isLMModified) {
        bank = 0x07;
    } else {
        bank = fileData[snes2pc(0x0EF100 + levelNum)];
    }

    let oldSpriteDataPointer = (bank << 16) | (high << 8) | low;

    // write header

    fileData[snes2pc(0x05F000 + levelNum)] = secondaryLevelHeader[0];
    fileData[snes2pc(0x05F200 + levelNum)] = secondaryLevelHeader[1];
    fileData[snes2pc(0x05F400 + levelNum)] = secondaryLevelHeader[2];
    fileData[snes2pc(0x05F600 + levelNum)] = secondaryLevelHeader[3];

    fileData[snes2pc(oldLayer1DataPointer+0)] = primaryLevelHeader[0];
    fileData[snes2pc(oldLayer1DataPointer+1)] = primaryLevelHeader[1];
    fileData[snes2pc(oldLayer1DataPointer+2)] = primaryLevelHeader[2];
    fileData[snes2pc(oldLayer1DataPointer+3)] = primaryLevelHeader[3];
    fileData[snes2pc(oldLayer1DataPointer+4)] = primaryLevelHeader[4];

    fileData[snes2pc(oldSpriteDataPointer)] = spriteHeader;

    if (!isLayer2) {
        if (defaultBGList.indexOf(bgPointer) != -1) {
            low =  (bgPointer >>> 0) & 0xFF;
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
            let header1: number, header2: number, header3: number, header4: number;

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

    let currentScreen: number;

    currentScreen = 0;

    for (let i = 0; i < layer1Data.length; i++) {
        let obj = layer1Data[i];
        let newScreenFlag: number;

        newScreenFlag = 0;

        if (obj.screen == currentScreen) {
            newScreenFlag = 0;
        } else if (obj.screen == currentScreen + 1) {
            newScreenFlag = 1;
            currentScreen++;
        } else if (obj.screen > currentScreen + 1) {
            newScreenFlag = 0;
            layer1DataBinary[layer1DataBinary.length] = obj.screen & 0b11111;
            layer1DataBinary[layer1DataBinary.length] = 0;
            layer1DataBinary[layer1DataBinary.length] = 1;
            currentScreen = obj.screen;
        } else if (obj.screen < currentScreen) {
            newScreenFlag = 0;
            layer1DataBinary[layer1DataBinary.length] = obj.screen & 0b11111;
            layer1DataBinary[layer1DataBinary.length] = 0;
            layer1DataBinary[layer1DataBinary.length] = 1;
            currentScreen = obj.screen;            
        }

        layer1DataBinary[layer1DataBinary.length] = (newScreenFlag << 7) | (((obj.objNum >>> 4) & 0b11) << 5) | (obj.y & 0b11111);
        layer1DataBinary[layer1DataBinary.length] = ((obj.objNum & 0b1111) << 4) | (obj.x & 0b1111);
        layer1DataBinary[layer1DataBinary.length] = obj.settings & 0xFF;
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
        throw new TypeError();
    }

    layer1DataBinary[layer1DataBinary.length] = 0xFF;

    let bgDataBinary: number[];

    // make layer2 data
    let layer2DataBinary = new Array();
    if (isLayer2) {
        layer2DataBinary[0] = 0;
        layer2DataBinary[1] = 0;
        layer2DataBinary[2] = 0;
        layer2DataBinary[3] = 0;
        layer2DataBinary[4] = 0;

        currentScreen = 0;

        for (let i = 0; i < layer2Data.length; i++) {
            let obj = layer2Data[i];
            let newScreenFlag: number;
    
            newScreenFlag = 0;
    
            if (obj.screen == currentScreen) {
                newScreenFlag = 0;
            } else if (obj.screen == currentScreen + 1) {
                newScreenFlag = 1;
                currentScreen++;
            } else if (obj.screen > currentScreen + 1) {
                newScreenFlag = 0;
                layer2DataBinary[layer2DataBinary.length] = obj.screen & 0b11111;
                layer2DataBinary[layer2DataBinary.length] = 0;
                layer2DataBinary[layer2DataBinary.length] = 1;
                currentScreen = obj.screen;
            } else if (obj.screen < currentScreen) {
                newScreenFlag = 0;
                layer2DataBinary[layer2DataBinary.length] = obj.screen & 0b11111;
                layer2DataBinary[layer2DataBinary.length] = 0;
                layer2DataBinary[layer2DataBinary.length] = 1;
                currentScreen = obj.screen;            
            }
    
            layer2DataBinary[layer2DataBinary.length] = (newScreenFlag << 7) | (((obj.objNum >>> 4) & 0b11) << 5) | (obj.y & 0b11111);
            layer2DataBinary[layer2DataBinary.length] = ((obj.objNum & 0b1111) << 4) | (obj.x & 0b1111);
            layer2DataBinary[layer2DataBinary.length] = obj.settings & 0xFF;
        }

        layer2DataBinary[layer2DataBinary.length] = 0xFF;
    } else {
        let arr1: number[], arr2: number[], arr: number[];
        arr1 = new Array();
        arr2 = new Array();

        for (let i = 0; i < bgData!.length; i++) {
            if (Math.floor(i / 16) % 2 == 0) {
                arr1[arr1.length] = bgData![i];
            } else {
                arr2[arr2.length] = bgData![i];
            }
        }

        arr = arr1.concat(arr2);

        bgDataBinary = compress_rle1(arr);

        if (arrayCompare(arr, decompress_rle1(bgDataBinary as any)) != true) {
            throw new Error();
        }

    }

    // make sprite data
    let spriteDataBinary = new Array((sprites.length * 3) + 2);
    spriteDataBinary[0] = spriteHeader;
    for (let i = 0; i < sprites.length; i++) {
        let spr = sprites[i];
        spriteDataBinary[1+(i*3)+2] = spr.spriteID & 0xFF;
        spriteDataBinary[1+(i*3)+0] = ((spr.yPosition & 0b1111) << 4) | ((spr.extra & 0b11) << 2) | 
            (((spr.screenNum >>> 4) & 0b1) << 1) | (((spr.yPosition >>> 4) & 0b1));
        spriteDataBinary[1+(i*3)+1] = ((spr.xPosition & 0b1111) << 4) | (spr.screenNum & 0b1111);
    }
    spriteDataBinary[spriteDataBinary.length - 1] = 0xFF;

    // delete old sprite data
    if (snes2pc(oldSpriteDataPointer) - 8 >= 0x80200 && 
    String.fromCharCode(
        fileData[snes2pc(oldSpriteDataPointer)-8], 
        fileData[snes2pc(oldSpriteDataPointer)-7], 
        fileData[snes2pc(oldSpriteDataPointer)-6],
        fileData[snes2pc(oldSpriteDataPointer)-5]
    ) == "STAR") {
        let size =    (fileData[snes2pc(oldSpriteDataPointer)-3] << 8) | fileData[snes2pc(oldSpriteDataPointer)-4];
        let invSize = (fileData[snes2pc(oldSpriteDataPointer)-1] << 8) | fileData[snes2pc(oldSpriteDataPointer)-2];
        if (((~size) & 0xFFFF) === (invSize & 0xFFFF)) {
            size++;
            fileData[snes2pc(oldSpriteDataPointer)-8] = 0;
            fileData[snes2pc(oldSpriteDataPointer)-7] = 0;
            fileData[snes2pc(oldSpriteDataPointer)-6] = 0;
            fileData[snes2pc(oldSpriteDataPointer)-5] = 0;
            fileData[snes2pc(oldSpriteDataPointer)-4] = 0;
            fileData[snes2pc(oldSpriteDataPointer)-3] = 0;
            fileData[snes2pc(oldSpriteDataPointer)-2] = 0;
            fileData[snes2pc(oldSpriteDataPointer)-1] = 0;

            for (let i = 0; i < size; i++) {
                fileData[snes2pc(oldSpriteDataPointer)+i] = 0;
            }            
        }       
    }

    // delete old layer1 data
    if (snes2pc(oldLayer1DataPointer) - 8 >= 0x80200 && 
    String.fromCharCode(
        fileData[snes2pc(oldLayer1DataPointer)-8], 
        fileData[snes2pc(oldLayer1DataPointer)-7], 
        fileData[snes2pc(oldLayer1DataPointer)-6],
        fileData[snes2pc(oldLayer1DataPointer)-5]
    ) == "STAR") {
        let size =    (fileData[snes2pc(oldLayer1DataPointer)-3] << 8) | fileData[snes2pc(oldLayer1DataPointer)-4];
        let invSize = (fileData[snes2pc(oldLayer1DataPointer)-1] << 8) | fileData[snes2pc(oldLayer1DataPointer)-2];
        if (((~size) & 0xFFFF) === (invSize & 0xFFFF)) {
            size++;
            fileData[snes2pc(oldLayer1DataPointer)-8] = 0;
            fileData[snes2pc(oldLayer1DataPointer)-7] = 0;
            fileData[snes2pc(oldLayer1DataPointer)-6] = 0;
            fileData[snes2pc(oldLayer1DataPointer)-5] = 0;
            fileData[snes2pc(oldLayer1DataPointer)-4] = 0;
            fileData[snes2pc(oldLayer1DataPointer)-3] = 0;
            fileData[snes2pc(oldLayer1DataPointer)-2] = 0;
            fileData[snes2pc(oldLayer1DataPointer)-1] = 0;

            for (let i = 0; i < size; i++) {
                fileData[snes2pc(oldLayer1DataPointer)+i] = 0;
            }            
        }
    }

    // delete old layer2/bg data
    if (snes2pc(oldLayer2DataPointer) - 8 >= 0x80200 && 
    String.fromCharCode(
        fileData[snes2pc(oldLayer2DataPointer)-8], 
        fileData[snes2pc(oldLayer2DataPointer)-7], 
        fileData[snes2pc(oldLayer2DataPointer)-6],
        fileData[snes2pc(oldLayer2DataPointer)-5]
    ) == "STAR") {
        console.log("Deleting Layer 2 / BG: " + oldLayer2DataPointer);

        let size =    (fileData[snes2pc(oldLayer2DataPointer)-3] << 8) | fileData[snes2pc(oldLayer2DataPointer)-4];
        let invSize = (fileData[snes2pc(oldLayer2DataPointer)-1] << 8) | fileData[snes2pc(oldLayer2DataPointer)-2];
        if (((~size) & 0xFFFF) === (invSize & 0xFFFF)) {
            size++;
            fileData[snes2pc(oldLayer2DataPointer)-8] = 0;
            fileData[snes2pc(oldLayer2DataPointer)-7] = 0;
            fileData[snes2pc(oldLayer2DataPointer)-6] = 0;
            fileData[snes2pc(oldLayer2DataPointer)-5] = 0;
            fileData[snes2pc(oldLayer2DataPointer)-4] = 0;
            fileData[snes2pc(oldLayer2DataPointer)-3] = 0;
            fileData[snes2pc(oldLayer2DataPointer)-2] = 0;
            fileData[snes2pc(oldLayer2DataPointer)-1] = 0;

            for (let i = 0; i < size; i++) {
                fileData[snes2pc(oldLayer2DataPointer)+i] = 0;
            }            
        }       
    }

    let free: number;

    // write sprite data
    free = getFreeSpace(spriteDataBinary.length);
    
    fileData[free+0] = "S".charCodeAt(0);
    fileData[free+1] = "T".charCodeAt(0);
    fileData[free+2] = "A".charCodeAt(0);
    fileData[free+3] = "R".charCodeAt(0);
    fileData[free+4] = ((spriteDataBinary.length - 1) >>> 0) & 0xFF;
    fileData[free+5] = ((spriteDataBinary.length - 1) >>> 8) & 0xFF;
    fileData[free+6] = (~(fileData[free+4])) & 0xFF;
    fileData[free+7] = (~(fileData[free+5])) & 0xFF;

    for (let i = 0; i < spriteDataBinary.length; i++) {
        fileData[free+8+i] = spriteDataBinary[i];
    }
    
    let addr: number;
    addr = pc2snes(free+8);

    fileData[snes2pc(spriteDataTable + (2 * levelNum) + 0)] = ((addr >>> 0) & 0xFF);
    fileData[snes2pc(spriteDataTable + (2 * levelNum) + 1)] = ((addr >>> 8) & 0xFF);

    if (!isLMModified) {
        throw new TypeError();
    } else {
        fileData[snes2pc(0x0EF100 + levelNum)] = ((addr >>> 16) & 0xFF);
    }
    
    // write layer 1 data
    free = getFreeSpace(layer1DataBinary.length);
    
    fileData[free+0] = "S".charCodeAt(0);
    fileData[free+1] = "T".charCodeAt(0);
    fileData[free+2] = "A".charCodeAt(0);
    fileData[free+3] = "R".charCodeAt(0);
    fileData[free+4] = ((layer1DataBinary.length - 1) >>> 0) & 0xFF;
    fileData[free+5] = ((layer1DataBinary.length - 1) >>> 8) & 0xFF;
    fileData[free+6] = (~(fileData[free+4])) & 0xFF;
    fileData[free+7] = (~(fileData[free+5])) & 0xFF;

    for (let i = 0; i < layer1DataBinary.length; i++) {
        fileData[free+8+i] = layer1DataBinary[i];
    }

    addr = pc2snes(free+8);

    fileData[snes2pc(layer1DatasTable + (3 * levelNum) + 0)] = ((addr >>> 0 ) & 0xFF);
    fileData[snes2pc(layer1DatasTable + (3 * levelNum) + 1)] = ((addr >>> 8 ) & 0xFF);
    fileData[snes2pc(layer1DatasTable + (3 * levelNum) + 2)] = ((addr >>> 16) & 0xFF);

    if (isLayer2) {
        // write layer 2 data
        free = getFreeSpace(layer2DataBinary.length);

        fileData[free+0] = "S".charCodeAt(0);
        fileData[free+1] = "T".charCodeAt(0);
        fileData[free+2] = "A".charCodeAt(0);
        fileData[free+3] = "R".charCodeAt(0);
        fileData[free+4] = ((layer2DataBinary.length - 1) >>> 0) & 0xFF;
        fileData[free+5] = ((layer2DataBinary.length - 1) >>> 8) & 0xFF;
        fileData[free+6] = (~(fileData[free+4])) & 0xFF;
        fileData[free+7] = (~(fileData[free+5])) & 0xFF;

        for (let i = 0; i < layer2DataBinary.length; i++) {
            fileData[free+8+i] = layer2DataBinary[i];
        }

        addr = pc2snes(free+8);

        fileData[snes2pc(layer2DatasTable + (3 * levelNum) + 0)] = ((addr >>> 0 ) & 0xFF);
        fileData[snes2pc(layer2DatasTable + (3 * levelNum) + 1)] = ((addr >>> 8 ) & 0xFF);
        fileData[snes2pc(layer2DatasTable + (3 * levelNum) + 2)] = ((addr >>> 16) & 0xFF);
    } else {  
        // write background data
        if (defaultBGList.indexOf(bgPointer) === -1) {
            free = getFreeSpace(bgDataBinary!.length);

            fileData[free+0] = "S".charCodeAt(0);
            fileData[free+1] = "T".charCodeAt(0);
            fileData[free+2] = "A".charCodeAt(0);
            fileData[free+3] = "R".charCodeAt(0);
            fileData[free+4] = ((bgDataBinary!.length - 1) >>> 0) & 0xFF;
            fileData[free+5] = ((bgDataBinary!.length - 1) >>> 8) & 0xFF;
            fileData[free+6] = (~(fileData[free+4])) & 0xFF;
            fileData[free+7] = (~(fileData[free+5])) & 0xFF;

            for (let i = 0; i < bgDataBinary!.length; i++) {
                fileData[free+8+i] = bgDataBinary![i];
            }

            addr = pc2snes(free+8);

            
            fileData[snes2pc(layer2DatasTable + (3 * levelNum) + 0)] = ((addr >>> 0 ) & 0xFF);
            fileData[snes2pc(layer2DatasTable + (3 * levelNum) + 1)] = ((addr >>> 8 ) & 0xFF);
            fileData[snes2pc(layer2DatasTable + (3 * levelNum) + 2)] = ((addr >>> 16) & 0xFF);    
        }  
    }

    if (!isLMModified) {
        throw new Error();
    } else {
        let bgfg = (isLayer2? 0: 1);
        let flag = 0;

        fileData[snes2pc(0x0EF310 + levelNum)] = (((bgfg) & 0b1) << 1) | ((flag & 0b1) << 2) | ((bgPage & 0b1111) << 4);
    }
}

function stage_onmousemove(this: any, e: MouseEvent): void {
    if (!isPress) return;

    let data: Obj[];

    if (editMode == "layer1") {
        data = layer1Data
    } else if (editMode == "layer2") {
        data = layer2Data
    } else {
        data = layer1Data;
    }

    let index: number;

    index = safeParseInt((target as any).getAttribute("data-index"));
    
    const deltaX = Math.floor((e.clientX - prevPosX) / 16) * 16;
    const deltaY = Math.floor((e.clientY - prevPosY) / 16) * 16;

    if (!((prevObjLeft + deltaX) >= 0 && (prevObjLeft + deltaX) <= this.offsetWidth - 1)) {
        return;
    }

    if (!((prevObjTop + deltaY) >= 0 && (prevObjTop + deltaY) <= this.offsetHeight - 1)) {
        return;
    }


    if (editMode == "layer1" || editMode == "layer2") {
        data[index].screen = Math.floor(Math.floor((prevObjLeft + deltaX) / 16) / 16);
        if (isVertical) {
            data[index].y = getRealY((Math.floor((prevObjLeft + deltaX) / 16) % 16) & 0b11111, data[index]);
            data[index].x = getRealX(Math.floor((prevObjTop + deltaY) / 16) & 0b1111, data[index]); 
        } else {
            data[index].x = getRealX((Math.floor((prevObjLeft + deltaX) / 16) % 16) & 0b1111, data[index]);
            data[index].y = getRealY(Math.floor((prevObjTop + deltaY) / 16) & 0b11111, data[index]); 
        }
        
    } else {
        sprites[index].screenNum = Math.floor(Math.floor((prevObjLeft + deltaX) / 16) / 16);
        if (isVertical) {
            sprites[index].yPosition = (Math.floor((prevObjLeft + deltaX) / 16) % 16) & 0b11111;
            sprites[index].xPosition = Math.floor((prevObjTop + deltaY) / 16) & 0b1111; 
        } else {
            sprites[index].xPosition = (Math.floor((prevObjLeft + deltaX) / 16) % 16) & 0b1111;
            sprites[index].yPosition = Math.floor((prevObjTop + deltaY) / 16) & 0b11111;             
        }
    }

    target!.style.left = (prevObjLeft + deltaX) + "px";
    target!.style.top = (prevObjTop + deltaY) + "px";
}

function stage_onkeydown(this: any, e: KeyboardEvent): void {
    if (e.code == "Insert") {
        let data: Obj[];
    
        if (editMode == "layer1") {
            data = layer1Data;
        } else if (editMode == "layer2") {
            data = layer2Data;
        } else {
            data = layer1Data;
        }

        if (editMode == "layer1" || editMode == "layer2") {
            let input: Nullable<string>;
            let val: number;
    
            input = prompt("Object Number? (in hex)", "01");
            
            if (input === null) return;

            let initValue = 0;
            
            try {
                
                val = safeParseInt("0x" + input);
                val = val & 0b111111;
                if (!(val >= 0 && val <= 255)) {
                    throw new Error();
                }
                if (val === 0) {
                    initValue = 0x10;
                } else if (val > 0x21 && val < 0x30) {
                    throw new Error();
                }
            } catch (e) {
                alert("Invalid");
                return;
            }
    
            let obj: Obj;
    
            obj = new Obj(val, 0, 0, initValue);
    
            data.push(obj);

            //render();      

            let stage = document.querySelector("#stage");
    
            let myObject = document.createElement("div");
            myObject.innerHTML = hex(obj.objNum) + "<br>" + hex(obj.settings);
    
            let bgColor: string, zIndex: number;
    
            if (editMode == "layer1") {
                myObject.className = "object layer1";
                bgColor = 'chartreuse';
                zIndex = (data.length - 1) + 0x800000;
            } else if (editMode == "layer2") {
                myObject.className = "object layer2";
                bgColor = "red";
                zIndex = (data.length - 1);
            } else {
                throw new Error("unimplemented");
            }     
            
            //myObject.style.border = "1px solid black";
            myObject.style.position = "absolute";
            myObject.style.backgroundColor = bgColor;

            myObject.style.top = (getY(obj) * 16) + 'px';
            myObject.style.left = ((256 * obj.screen) + (getX(obj) * 16)) + 'px';
            
            myObject.style.zIndex = zIndex + "";       
            myObject.onmousedown = obj_onmousedown;
            myObject.onkeydown = obj_onkeydown;
            myObject.ondblclick = obj_ondblclick;
            myObject.setAttribute("data-index", (data.length - 1).toString());
            myObject.tabIndex = -1;
    
            myObject.style.width = (getObjWidth(obj) * 16 ) + 'px';
            myObject.style.height = (getObjHeight(obj) * 16 ) + 'px';
            myObject.style.fontSize = '8px';

            const img = getObjImage(obj);
            if (img) {
                myObject.style.border = "";
                myObject.style.backgroundColor = '';
                //myObject.innerHTML = "";
                myObject.style.backgroundImage = `url(${img})`;
            }

            stage!.appendChild(myObject);
            
        } else {
            let input: Nullable<string>;
            let val: number;
    
            input = prompt("Object Number? (in hex)", "01");
            
            if (input === null) return;
            
            try {
                val = safeParseInt("0x" + input);
                val = val & 0xFF;
                if (!(val >= 0 && val <= 255)) {
                    throw new Error();
                }
            } catch (e) {
                alert("Invalid");
                return;
            }

            let spr: Sprite;
            
            spr = new Sprite();
            spr.screenNum = 0;
            spr.xPosition = 0;
            spr.yPosition = 0;
            spr.extra = 0;
            spr.spriteID = val;

            sprites.push(spr);
            
            //render();

            


            let stage = document.querySelector("#stage");

            let myObject = document.createElement("div");
            myObject.className = "sprite";
            myObject.innerHTML = hex(spr.spriteID) + "<br>" + hex(spr.extra);  
        
            //myObject.style.border = "1px solid black";
            myObject.style.position = "absolute";
            myObject.style.backgroundColor = 'lightblue';

            myObject.style.top = (spr.yPosition * 16) + 'px';
            myObject.style.left = ((256 * spr.screenNum) + (spr.xPosition * 16)) + 'px';
            
            myObject.style.zIndex = (0x1800000).toString();
            myObject.setAttribute("data-index", (sprites.length - 1).toString());
            myObject.tabIndex = -1;

            myObject.ondblclick = spr_ondblclick;
            myObject.onkeydown = spr_onkeydown;
            myObject.onmousedown = obj_onmousedown;

            myObject.style.width = '16px';
            myObject.style.height = '16px';
            myObject.style.fontSize = '8px';

            const img = getSprImg(spr.spriteID, spr.extra);

            if (img) {
                myObject.style.border = "";
                myObject.style.backgroundColor = '';
                //myObject.innerHTML = "";
                myObject.style.backgroundImage = `url(${img})`;
            }

            stage!.appendChild(myObject);      
            
        }
    }
}

function obj_onkeydown(this: any, e: KeyboardEvent): void {
    let data: Obj[];

    if (!this.classList.contains(editMode)) {
        return;
    }

    if (editMode == "layer1") {
        data = layer1Data;
    } else if (editMode == "layer2") {
        data = layer2Data;
    } else {
        return;
    }

    if (e.code == "Delete") {
        let index = safeParseInt(this.getAttribute("data-index"));
        let elements = document.querySelectorAll(".object." + editMode);

        for (let i = index; i < data.length - 1; i++ ) {
            data[i] = data[i+1];
        }

        for (let i = index; i < data.length - 1; i++ ) {
            elements[i].setAttribute("data-index", (i-1).toString());
        }

        data.length = data.length - 1;
        this.parentElement!.removeChild(this);

        return;
    } else if (e.code == "Equal" || e.code == "NumpadAdd") {
        let index = safeParseInt(this.getAttribute("data-index"));
        
        let element: any 
        if (editMode == "layer1") {
            element = document.querySelector('.layer1.object[data-index="' + (index+1) + '"]');
        } else if (editMode == "layer2") {
            element = document.querySelector('.layer2.object[data-index="' + (index+1) + '"]');
        } else {
            return;
        }

        if (index < data.length - 1) {
            let temp;
            temp = data[index];
            data[index] = data[index+1];
            data[index+1] = temp;

            let zIndex;
            if (editMode == "layer1") {
                zIndex = index + 0x800000;
            } else if (editMode == "layer2") {
                zIndex = index;
            } else {
                zIndex = 0x1800000;
            }

            element.style.zIndex = zIndex + "";
            element.setAttribute("data-index", index);
            this.setAttribute("data-index", index+1);
            this.style.zIndex = (zIndex + 1) + "";
        } else {
            return;
        }
    } else if (e.code == "Minus" || e.code == "NumpadSubtract") {
        let index = safeParseInt(this.getAttribute("data-index"));

        let element: any;
        if (editMode == "layer1") {
            element = document.querySelector('.layer1.object[data-index="' + (index-1) + '"]');
        } else if (editMode == "layer2") {
            element = document.querySelector('.layer2.object[data-index="' + (index-1) + '"]');
        } else {
            return;
        }

        if (index > 0) {
            let temp;
            temp = data[index];
            data[index] = data[index-1];
            data[index-1] = temp;

            let zIndex;
            if (editMode == "layer1") {
                zIndex = index + 0x800000;
            } else if (editMode == "layer2") {
                zIndex = index;
            } else {
                zIndex = 0x1800000;
            }

            element.style.zIndex = zIndex + "";
            element.setAttribute("data-index", index);

            this.setAttribute("data-index", index-1);
            this.style.zIndex = (zIndex - 1) + "";

        } else {
            return;
        } 
    }
}

function obj_onmousedown(this: any, e: MouseEvent) {
    if (!this.classList.contains(editMode)) {
        return;
    }

    let objects = document.querySelectorAll(".object, .sprite");
    for (let i = 0; i < objects.length ; i++) {
        let obj: any = objects[i];
        //obj.style.border = "1px solid black";
        //obj.style.color = "black";
        obj.style.filter = '';
        obj.blur();
    }

    //this.style.border = "1px solid red";
    this.style.filter = 'invert(100%)';

    this.focus();

    e.stopPropagation();

    isPress = true;
    prevObjLeft = this.offsetLeft;
    prevObjTop = this.offsetTop;
    prevPosX = e.clientX;
    prevPosY = e.clientY;
    target = this;
}

function stage_onmousedown(this: any) {
    let objects = document.querySelectorAll(".object, .sprite");
    for (let i = 0; i < objects.length ; i++) {
        let obj: any = objects[i];
        //obj.style.border = "1px solid black";
        //obj.style.color = "black";
        obj.style.filter = '';
        obj.blur();
    }
    isPress = false;
}

function stage_onmouseup() {
    isPress = false;
}

function spr_onkeydown(this: any, e: KeyboardEvent): void {   
    if (!this.classList.contains(editMode)) {
        return;
    }

    if (e.code === "Delete") {
        let index = safeParseInt(this.getAttribute("data-index"));
        let elements = document.querySelectorAll(".sprite");
    
        for (let i = index; i < sprites.length - 1; i++ ) {
            sprites[i] = sprites[i+1];
        }
    
        for (let i = index; i < sprites.length - 1; i++ ) {
            elements[i].setAttribute("data-index", (i-1).toString());
        }
    
        sprites.length = sprites.length - 1;
    
        this.parentElement!.removeChild(this);
        return;
    }
}

function obj_ondblclick(this: any, e: MouseEvent): void {
    let data: Obj[];
    let index: number;
    let extraData: number;
    let input: Nullable<string>;
    let val: number;
    let objNum: number;
    let width: number, height: number;

    if (!this.classList.contains(editMode)) {
        return;
    }

    if (editMode == "layer1") {
        data = layer1Data;
    } else if (editMode == "layer2") {
        data = layer2Data
    } else {
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
        
    } catch (e) {
        alert("Invalid");
        return;
    }

    data[index].settings = val & 0xFF;

    this.innerHTML = (hex(objNum) + '<br>') + hex(val);

    width = getObjWidth(obj);
    height = getObjHeight(obj);

    this.style.width = (width * 16) + 'px';
    this.style.height = (height * 16) + 'px';

    const img = getObjImage(obj);
    if (img) {
        this.style.border = "";
        this.style.backgroundColor = '';
        //this.innerHTML = "";
        this.style.backgroundImage = `url(${img})`;
    }

    
}

function spr_ondblclick(this: any, e: MouseEvent): void {
    if (!this.classList.contains(editMode)) {
        return;
    }

    let index: number;
    let extra: number;

    index = safeParseInt(this.getAttribute("data-index"));

    extra = sprites[index].extra;

    let input: Nullable<string>;

    input = prompt("Extra info (0-3)", hex(extra));

    if (input === null) {
        return;
    }

    let val: number;

    try {
        val = safeParseInt("0x" + input);
        val = val & 0b11;
        if (!(val >= 0 && val <= 3)) {
            throw new Error();
        }
        
    } catch (e) {
        alert("Invalid");
        return;
    }

    sprites[index].extra = val & 0b11;

    this.innerHTML = hex(sprites[index].spriteID) + '<br>' + hex(val);

    const spr = sprites[index];

    const img = getSprImg(spr.spriteID, spr.extra);

    if (img) {
        this.style.border = "";
        this.style.backgroundColor = '';
        //myObject.innerHTML = "";
        this.style.backgroundImage = `url(${img})`;
    }

    
}

function window_onload(): void {
    btnOpen = (document.getElementById("btnOpen") as HTMLButtonElement);
    btnPalette = (document.getElementById("btnPalette") as HTMLButtonElement);
    btn8x8 = (document.getElementById("btn8x8") as HTMLButtonElement);
    btn16x16 = (document.getElementById("btn16x16") as HTMLButtonElement);
    btnLevelToImage = (document.getElementById("btnLevelToImage") as HTMLButtonElement);
    btnLevelHeader = (document.getElementById("btnLevelHeader") as HTMLButtonElement);
    btnGFX = (document.getElementById("btnGFX") as HTMLButtonElement);
    btnSprHeader = (document.getElementById("btnSprHeader") as HTMLButtonElement)
    btnOtherHeader = (document.getElementById("btnOtherHeader") as HTMLButtonElement)
    btnEnter = (document.getElementById("btnEnter") as HTMLButtonElement)
    btnSwitchBG = (document.getElementById("btnSwitchBG") as HTMLButtonElement)
    btnBGCancel = (document.getElementById("btnBGCancel") as HTMLButtonElement)
    btnBGOK = (document.getElementById("btnBGOK") as HTMLButtonElement)
    selBG = (document.getElementById("selBG")) as HTMLSelectElement;
    btnEnterOK = (document.getElementById("btnEnterOK") as HTMLButtonElement);
    btnEnterCancel = (document.getElementById("btnEnterCancel") as HTMLButtonElement);
    btnSprHeaderOK = (document.getElementById("btnSprHeaderOK") as HTMLButtonElement);
    btnSprHeaderCancel = (document.getElementById("btnSprHeaderCancel") as HTMLButtonElement);
    btnOtherHeaderOK = (document.getElementById("btnOtherHeaderOK") as HTMLButtonElement);
    btnOtherHeaderCancel = (document.getElementById("btnOtherHeaderCancel") as HTMLButtonElement);
    btnPaletteOK = (document.getElementById("btnPaletteOK") as HTMLButtonElement);
    btnPaletteCancel = (document.getElementById("btnPaletteCancel") as HTMLButtonElement);
    selBackColor = (document.getElementById("selBackColor") as HTMLSelectElement);
    selFGColor = (document.getElementById("selFGColor") as HTMLSelectElement);
    selBGColor = (document.getElementById("selBGColor") as HTMLSelectElement);
    selSprColor = (document.getElementById("selSprColor") as HTMLSelectElement);
    btnGFXOK = (document.getElementById("btnGFXOK") as HTMLButtonElement);
    btnGFXCancel = (document.getElementById("btnGFXCancel") as HTMLButtonElement);
    main = (document.getElementById("main") as HTMLDivElement);
    btnHeaderOK = (document.getElementById("btnHeaderOK") as HTMLButtonElement);
    btnHeaderCancel = (document.getElementById("btnHeaderCancel") as HTMLButtonElement);
    btnExit = (document.getElementById("btnExit") as HTMLButtonElement);
    selScrNumber = (document.getElementById("selScrNumber") as HTMLSelectElement);
    btnExitOK = (document.getElementById("btnExitOK") as HTMLButtonElement);
    btnExitDelete = (document.getElementById("btnExitDelete") as HTMLButtonElement);
    btnExitCancel = (document.getElementById("btnExitCancel") as HTMLButtonElement);
    btn2ndExit = (document.getElementById("btn2ndExit") as HTMLButtonElement);
    sel2ndEnter = (document.getElementById("sel2ndEnter") as HTMLSelectElement)
    btn2ndOK = (document.getElementById("btn2ndOK") as HTMLButtonElement)
    btn2ndCancel = (document.getElementById("btn2ndCancel") as HTMLButtonElement)
    btnSave = (document.getElementById("btnSave") as HTMLButtonElement)
    
    document.getElementById("paletteView")!.onclick = paletteView_onclick;

    btnPalette!.onclick = btnPalette_onclick;
    btnOpen!.onclick = btnOpen_onclick;
    btn8x8!.onclick = btn8x8_onclick;
    btn16x16!.onclick = btn16x16_onclick;
    btnLevelToImage!.onclick = btnLevelToImage_onclick;
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
    const blob = new Blob([buffer], {type: 'application/octet-stream'});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = fileName;
    a.click();
}

function btnPalette_onclick(): void {
    let dialogPalette = document.getElementById("dialogPalette");
    if (dialogPalette?.classList.contains("hidden")) {
        dialogPalette.classList.remove("hidden");
    } else {
        dialogPalette!.classList.add("hidden");
        return;
    }

    let backColor = getBackAreaColor(backAreaColorNum);
    document.getElementById("backColorView")!.style.backgroundColor = `rgb(${backColor.r}, ${backColor.g}, ${backColor.b})`;

    let paletteImage = getPalImage(pal);
  
    let paletteView: HTMLCanvasElement = (document.getElementById("paletteView") as HTMLCanvasElement);

    paletteView.width = paletteImage.width;
    paletteView.height = paletteImage.height;

    let ctx = paletteView.getContext("2d");

    ctx!.putImageData(paletteImage, 0, 0);

    let selBackColor: any = document.getElementById("selBackColor");
    let selBGColor: any = document.getElementById("selBGColor");
    let selFGColor: any = document.getElementById("selFGColor");
    let selSprColor: any = document.getElementById("selSprColor");

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

    let oldCanvas: HTMLElement;

    oldCanvas = document.getElementById("cnv16x16")!;

    if (oldCanvas) {
        document.body.removeChild(oldCanvas);
        return;
    }
    
    let blocks = map16;

    let canvas = document.createElement("canvas");

    canvas.id = "cnv16x16";
    canvas.style.border = "1px solid black";
    canvas.width = 16 * 16;
    canvas.height = 16  * 16 * 2 * 2;
    
    let ctx = canvas.getContext("2d");

    for (let i = 0x0; i <= 0x1ff; i++) {
        const tile = getMap16TileImg(i);
        ctx!.putImageData(tile, (i % 16) * 16, intdiv(i, 16) * 16);
    }

    // background tiles
    blocks = bgTiles;  

    for (let i = 0x0; i <= 0x1ff; i++) {
        const tile = getMap16TileImg(i, true);
        ctx!.putImageData(tile, (i % 16) * 16, (0x1F * 16) + (intdiv(i, 16) * 16));
    }    
    
    document.body.appendChild(canvas);
}

function btn8x8_onclick () {
    if (fileName == "") {
        alert("Open the file");
        return;
    }

    const dotSize: number = 2;

    let canvas: HTMLCanvasElement;
    
    canvas = document.getElementById("cnv8x8")! as HTMLCanvasElement;

    if (canvas) {
        document.body.removeChild(canvas);
        return;
    }

    canvas = document.createElement("canvas");
    canvas.id = "cnv8x8";
    
    canvas.style.border = "1px solid black";
    canvas.width = dotSize * 8 * 16;
    canvas.height = dotSize * 8 * 16 * 2 * 2;

    let ctx = canvas.getContext("2d");
    
    const bitmaps = [fg1bmp, fg2bmp, bgbmp, fg3bmp, sp1bmp, sp2bmp, sp3bmp, sp4bmp];

    for (let i = 0; i < bitmaps.length; i++) {
        const bitmap = bitmaps[i];
        for (let j = 0; j < bitmap.length; j++) {
            const bmp = bitmap[j];
           
            const div: number = intdiv(j, 16);
            const mod: number = j % 16;;

            for (let k = 0; k < 64; k++) {
                const color = pal[0][bmp[k]];
                const r = color.r;
                const g = color.g;
                const b = color.b;
                ctx!.fillStyle = `rgb(${r}, ${g}, ${b})`;
                ctx!.fillRect((dotSize * 8 * mod)+((k % 8) * dotSize), 
                    (dotSize * 8 * div)+((Math.floor(k / 8)) * dotSize)+((64*i)*dotSize), 
                    dotSize, dotSize);
            }
        }
    }

    document.body.appendChild(canvas);
}

function btnOpen_onclick() {
    fileOpen();
}

function btnLevelToImage_onclick(): void {
    const global: any = globalThis;
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
    }).then(function (canvas: HTMLCanvasElement): void {
        const url = canvas.toDataURL();
        const a = document.createElement("a");
        a.href = url;
        a.download = "Level" + levelNum.toString(16).toUpperCase() + ".png";
        a.click();
    }).catch(function (err: Error): void {
        alert("Error: " + err.message);
        return;
    });
}

function btnLevelHeader_onclick() {
    let dialogLevelHeader = document.getElementById("dialogLevelHeader");
    if (dialogLevelHeader?.classList.contains("hidden")) {
        dialogLevelHeader.classList.remove("hidden");
    } else {
        dialogLevelHeader!.classList.add("hidden");
        return;
    }
    const selLevelMode: any = document.getElementById("selLevelMode");
    const selTimer: any = document.getElementById("selTimer");
    const selMusic: any = document.getElementById("selMusic");
    const selScreenLength: any = document.getElementById("selScreenLength");
    const selItemMemory: any = document.getElementById("selItemMemory");
    const checkForceLayer3: any = document.getElementById("checkForceLayer3");
    const selVerticalScrollSetting: any = document.getElementById("selVerticalScrollSetting");

    selLevelMode.value = levelMode.toString();
    selTimer.value = timer.toString();
    selMusic.value = music.toString();
    selScreenLength.value = screenLength.toString();
    selItemMemory.value = itemMemory.toString();
    selVerticalScrollSetting.value = verticalScrollSetting.toString();
    if (layer3Prior) {
        checkForceLayer3.checked = true;
    } else {
        checkForceLayer3.checked = false;
    }

}

function btn2ndOK_onclick(this: void) {
    const txt2ndDest: any = document.getElementById("txt2ndDest");
    const txt2ndScrNum: any = document.getElementById("txt2ndScrNum");
    const sel2ndEnterX: any = document.getElementById("sel2ndEnterX");
    const sel2ndEnterY: any = document.getElementById("sel2ndEnterY");
    const sel2ndEnterFG: any = document.getElementById("sel2ndEnterFG");
    const sel2ndEnterBG: any = document.getElementById("sel2ndEnterBG");
    const sel2ndMarioAction: any = document.getElementById("sel2ndMarioAction");
    
    const index: number = safeParseInt(sel2ndEnter.value);

    const exit = secondExits[index];

    let dest: number;
    let scrNum: number;

    try {
        scrNum = safeParseInt('0x' + txt2ndScrNum.value);
    } catch (e) {
        scrNum = 0;
    }

    try {
        dest = safeParseInt('0x' + txt2ndDest.value);
    } catch (e) {
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
    } else {
        dialog!.classList.add("hidden");
        return;
    }
}

function btn2ndExit_onclick() {
    let dialog = document.getElementById("dialog2ndExit");

    if (dialog?.classList.contains("hidden")) {
        dialog.classList.remove("hidden");
    } else {
        dialog!.classList.add("hidden");
        return;
    }

    let parent = sel2ndEnter.parentElement;
    let oldIndex: number;

    if (sel2ndEnter.value === "") {
        oldIndex = 0;
    } else {
        oldIndex = safeParseInt(sel2ndEnter.value);
    }

    parent!.removeChild(sel2ndEnter);
    sel2ndEnter = document.createElement("select");
    sel2ndEnter.id = 'sel2ndEnter';
    parent!.appendChild(sel2ndEnter);
    sel2ndEnter.onchange = sel2ndEnter_onchange;

    for (let i = 0; i < secondExits.length; i++) {
        const exit = secondExits[i];
        const option = document.createElement("option");

        option.value = i + "";
        
        if (exit.dest == 0 || exit.dest == 0x100) {
            option.innerText = '#' + hex(i, 3);            
        } else {
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

    const txt2ndDest: any = document.getElementById("txt2ndDest");
    const txt2ndScrNum: any = document.getElementById("txt2ndScrNum");
    const sel2ndEnterX: any = document.getElementById("sel2ndEnterX");
    const sel2ndEnterY: any = document.getElementById("sel2ndEnterY");
    const sel2ndEnterFG: any = document.getElementById("sel2ndEnterFG");
    const sel2ndEnterBG: any = document.getElementById("sel2ndEnterBG");
    const sel2ndMarioAction: any = document.getElementById("sel2ndMarioAction");

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
    } else {
        dialog!.classList.add("hidden");
        return;
    }
}

function btnExitOK_onclick() {
    const chkUseSecond: any = document.getElementById("chkUseSecond");
    const chkUseSecondWater: any = document.getElementById("chkUseSecondWater");
    const txtExitDest: any = document.getElementById("txtExitDest");

    const scrNum = safeParseInt(selScrNumber.value);
    const useSecond = ((chkUseSecond.checked)? 1: 0);
    const useSecondWater = ((chkUseSecondWater.checked)? 1: 0);
    const dest = safeParseInt("0x" + txtExitDest.value);

    let i: number;
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
    } else {
        dialog!.classList.add("hidden");
        return;
    }
}

function btnExitDelete_onclick() {
    const scrNum = safeParseInt(selScrNumber.value)

    for (let i = 0; i < exits.length; i++) {
        let exit = exits[i];
        if (exit.scrNumber == scrNum) {
            exits.splice(i, 1);
        }
    }

    let dialog = document.getElementById("dialogExit");

    if (dialog?.classList.contains("hidden")) {
        dialog.classList.remove("hidden");
    } else {
        dialog!.classList.add("hidden");
        return;
    }
}

function btnExitCancel_onclick() {
    let dialog = document.getElementById("dialogExit");

    if (dialog?.classList.contains("hidden")) {
        dialog.classList.remove("hidden");
    } else {
        dialog!.classList.add("hidden");
        return;
    }
}

function btnExit_onclick() {
    let dialog = document.getElementById("dialogExit");

    if (dialog?.classList.contains("hidden")) {
        dialog.classList.remove("hidden");
    } else {
        dialog!.classList.add("hidden");
        return;
    }

    selScrNumber.value = "0";
    selScrNumber_onchange();
}

function selScrNumber_onchange() {
    const that = selScrNumber;
    const scrNum = safeParseInt(that.value);
    const txtExitDest: any = document.getElementById("txtExitDest");
    const chkUseSecond: any = document.getElementById("chkUseSecond");
    const chkUseSecondWater: any = document.getElementById("chkUseSecondWater");

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
            } else {
                chkUseSecond.checked = false;
                chkUseSecondWater.disabled = true;
            }

            if (exit.isWaterMid) {
                chkUseSecondWater.checked = true;
            } else {
                chkUseSecondWater.checked = false;
            }

            return;
        } 
    }
}

function btnHeaderOK_onclick() {
    const selLevelMode: any = document.getElementById("selLevelMode");
    const selTimer: any = document.getElementById("selTimer");
    const selMusic: any = document.getElementById("selMusic");
    const selScreenLength: any = document.getElementById("selScreenLength");
    const selItemMemory: any = document.getElementById("selItemMemory");
    const checkForceLayer3: any = document.getElementById("checkForceLayer3");
    const selVerticalScrollSetting: any = document.getElementById("selVerticalScrollSetting");
    
    const oldIsLayer2 = isLayer2;
    const oldIsVertical = isVertical;
    const oldLevelMode = levelMode;

    const newLevelMode =  safeParseInt(selLevelMode.value);

    const newIsVertical = !!(verticalList[newLevelMode]);
    const newIsLayer2 = !!(layer2List[newLevelMode] != 0);

    if (oldIsLayer2 == true && newIsLayer2 == false) {
        layer2Data = new Array();
        
        bgPointer = 0x0CE8EE;
        bgPage = getBGPage(bgPointer);
        bgData = loadBG(bgPointer);

        layer2DataPointer = 0;
    } else if (oldIsLayer2 == false && newIsLayer2 == true) {
        layer2Data = new Array();

        bgPointer = 0;
        bgPage = 0;
        bgData = loadBG(bgPointer);
    }

    levelMode = newLevelMode;
    isLayer2 = newIsLayer2
    isVertical = newIsVertical;

    timer = safeParseInt(selTimer.value)
    music = safeParseInt(selMusic.value);
    screenLength = safeParseInt(selScreenLength.value)
    itemMemory = safeParseInt(selItemMemory.value)
    verticalScrollSetting = safeParseInt(selVerticalScrollSetting.value);
    if (checkForceLayer3.checked == true) {
        layer3Prior = 1
    } else {
        layer3Prior = 0
    }

    render();

    let dialog = document.getElementById("dialogLevelHeader");

    if (dialog?.classList.contains("hidden")) {
        dialog.classList.remove("hidden");
    } else {
        dialog!.classList.add("hidden");
        return;
    }
}

function btnHeaderCancel_onclick() {
    let dialog = document.getElementById("dialogLevelHeader");

    if (dialog?.classList.contains("hidden")) {
        dialog.classList.remove("hidden");
    } else {
        dialog!.classList.add("hidden");
        return;
    }
}

function btnGFXOK_onclick() {
    const selFGBGGFX: any = document.getElementById("selFGBGGFX");
    const selSprGFX: any = document.getElementById("selSprGFX");

    fgbgGFX = safeParseInt(selFGBGGFX.value)
    sprGFX = safeParseInt(selSprGFX.value);

    loadGraphics();
    load16x16();
    render();

    let dialog = document.getElementById("dialogGFX");

    if (dialog?.classList.contains("hidden")) {
        dialog.classList.remove("hidden");
    } else {
        dialog!.classList.add("hidden");
        return;
    }

}

function btnGFXCancel_onclick() {
    let dialog = document.getElementById("dialogGFX");

    if (dialog?.classList.contains("hidden")) {
        dialog.classList.remove("hidden");
    } else {
        dialog!.classList.add("hidden");
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
    let selBackColor: any = document.getElementById("selBackColor");
    let selBGColor: any = document.getElementById("selBGColor");
    let selFGColor: any = document.getElementById("selFGColor");
    let selSprColor: any = document.getElementById("selSprColor");

    let backAreaColorNum, bgPalNum, fgPalNum, spPalNum;

    backAreaColorNum = safeParseInt(selBackColor.value);
    bgPalNum = safeParseInt(selBGColor.value);
    fgPalNum = safeParseInt(selFGColor.value);
    spPalNum = safeParseInt(selSprColor.value);

    let backColor = getBackAreaColor(backAreaColorNum);
    document.getElementById("backColorView")!.style.backgroundColor = `rgb(${backColor.r}, ${backColor.g}, ${backColor.b})`;

    let pal: RGB[][], bgColor: RGB;

    bgColor = getBackAreaColor(backAreaColorNum);
    pal = getPalette(bgPalNum, fgPalNum, spPalNum);

    let paletteImage = getPalImage(pal);
  
    let paletteView: HTMLCanvasElement = (document.getElementById("paletteView") as HTMLCanvasElement);

    paletteView.width = paletteImage.width;
    paletteView.height = paletteImage.height;

    let ctx = paletteView.getContext("2d");

    ctx!.putImageData(paletteImage, 0, 0);
}

function btnPaletteOK_onclick() {
    let selBackColor: any = document.getElementById("selBackColor");
    let selBGColor: any = document.getElementById("selBGColor");
    let selFGColor: any = document.getElementById("selFGColor");
    let selSprColor: any = document.getElementById("selSprColor");

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
    } else {
        dialog!.classList.add("hidden");
        return;
    }
}

function btnPaletteCancel_onclick() {
    let dialog = document.getElementById("dialogPalette");

    if (dialog?.classList.contains("hidden")) {
        dialog.classList.remove("hidden");
    } else {
        dialog!.classList.add("hidden");
        return;
    }
}

function btnOtherHeaderOK_onclick() {
    const selLayer2ScrollingRate: any = document.getElementById("selLayer2ScrollingRate");
    const selLayer3Option: any = document.getElementById("selLayer3Option");
    const checkVerticalLevelPositioning: any = document.getElementById("checkVerticalLevelPositioning");
    const checkVerticalLevelUnknown: any = document.getElementById("checkVerticalLevelUnknown");
    const checkDisableNoYoshi: any = document.getElementById("checkDisableNoYoshi");

    layer2ScrollSetting = safeParseInt(selLayer2ScrollingRate.value);
    layer3Setting = safeParseInt(selLayer3Option.value);

    if (checkVerticalLevelPositioning.checked) {
        verticalLevelPositioning = 1;
    } else {
        verticalLevelPositioning = 0;
    }

    if (checkVerticalLevelUnknown.checked) {
        verticalLevelUnknown = 1;
    } else {
        verticalLevelUnknown = 0;
    }

    if (checkDisableNoYoshi.checked) {
        disableNoYoshi = 1;
    } else {
        disableNoYoshi = 0;
    }

    let dialog = document.getElementById("dialogOtherHeader");

    if (dialog?.classList.contains("hidden")) {
        dialog.classList.remove("hidden");
    } else {
        dialog!.classList.add("hidden");
        return;
    }
}

function btnOtherHeaderCancel_onclick() {
    let dialog = document.getElementById("dialogOtherHeader");

    if (dialog?.classList.contains("hidden")) {
        dialog.classList.remove("hidden");
    } else {
        dialog!.classList.add("hidden");
        return;
    }
}

function btnSprHeaderOK_onclick() {
    const selSprMemory: any = document.getElementById("selSprMemory");
    const schkSprBuoy1: any = document.getElementById("chkSprBuoy1");
    const schkSprBuoy2: any = document.getElementById("chkSprBuoy2");

    sprMemory = safeParseInt(selSprMemory.value);

    if (schkSprBuoy1.checked) {
        buoyancy = 1;
    } else {
        buoyancy = 0;
    }

    if (schkSprBuoy2.checked) {
        buoyancy2 = 1;
    } else {
        buoyancy2 = 0;
    }

    let dialog = document.getElementById("dialogSprHeader");

    if (dialog?.classList.contains("hidden")) {
        dialog.classList.remove("hidden");
    } else {
        dialog!.classList.add("hidden");
        return;
    }
}

function btnSprHeaderCancel_onclick() {
    let dialog = document.getElementById("dialogSprHeader");

    if (dialog?.classList.contains("hidden")) {
        dialog.classList.remove("hidden");
    } else {
        dialog!.classList.add("hidden");
        return;
    }
}

function btnEnterOK_onclick() {
    const txtScrNum: any = document.getElementById("scrNum");
    const txtMidNum: any = document.getElementById("midNum");
    const selEnterX: any = document.getElementById("selEnterX");
    const selEnterY: any = document.getElementById("selEnterY");
    const selEnterFG: any = document.getElementById("selEnterFG");
    const selEnterBG: any = document.getElementById("selEnterBG");
    const selMarioAction: any = document.getElementById("selMarioAction");

    enterX = safeParseInt(selEnterX.value);
    enterY = safeParseInt(selEnterY.value);
    enterFG = safeParseInt(selEnterFG.value);
    enterBG = safeParseInt(selEnterBG.value);
    enterAction = safeParseInt(selMarioAction.value)

    let scrNum, midNum;
    
    try {
        scrNum = safeParseInt("0x" + txtScrNum.value);
    } catch (e) {
        scrNum = 0;
    }

    try {
        midNum = safeParseInt("0x" + txtMidNum.value);
    } catch (e) {
        midNum = 0;
    }

    if (scrNum < 0) {
        scrNum = 0;
    } else if (scrNum > 0x1F) {
        scrNum = 0x1F;
    }

    if (midNum < 0) {
        midNum = 0;
    } else if (midNum > 0xF) {
        midNum = 0xF;
    }

    enterScrNum = scrNum;
    midScrNum = midNum;

    let dialogEnter = document.getElementById("dialogEnter");

    if (dialogEnter?.classList.contains("hidden")) {
        dialogEnter.classList.remove("hidden");
    } else {
        dialogEnter!.classList.add("hidden");
        return;
    }
}

function btnEnterCancel_onclick() {
    let dialogEnter = document.getElementById("dialogEnter");

    if (dialogEnter?.classList.contains("hidden")) {
        dialogEnter.classList.remove("hidden");
    } else {
        dialogEnter!.classList.add("hidden");
        return;
    }
}

function btnBGCancel_onclick() {
    let dialogBG = document.getElementById("dialogBG");
    dialogBG!.classList.add("hidden");
}

function selBG_onchange(this: any) {
    let val = safeParseInt(this.value);
    let bgAddr: number;

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

    let bgp: number;
    
    if (defaultBGList.indexOf(bgAddr) != -1) {
        bgp = getBGPage(bgAddr);
    } else {
        bgp = bgPage;
    }

    let bgData = loadBG(bgAddr);  
    
    let bgBitmap = getBG(bgData, bgp);

    const canvas: HTMLCanvasElement = (document.getElementById("bgPreview") as any);

    canvas.width = 32 * 16;
    canvas.height = 27 * 16;

    canvas.style.backgroundColor = `rgb(${bgColor.r}, ${bgColor.g}, ${bgColor.b})`;

    let ctx = canvas.getContext("2d");

    try {
        ctx!.putImageData(bgBitmap!, 0, 0);
    } catch (e) {

    }

}

function btnBGOK_onclick() {
    let dialogBG = document.getElementById("dialogBG");
    
    dialogBG!.classList.add("hidden");

    const selBG: any = document.getElementById("selBG");

    let bgNum: number = safeParseInt(selBG.value);

    let bgAddr: number;

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
    } else {
        dialogBG!.classList.add("hidden");
        return;
    }    

    const selBG: any = document.getElementById("selBG");

    let bgNum: number;

    switch (bgPointer) {
        case 0x0CD900:
            bgNum = 0;
            break;
        case 0x0CDAB9:
            bgNum = 1;
            break
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
    } else {
        selBG.disabled = false;
        btnBGOK.disabled = false;
    }

    selBG.onchange();
}

function btnEnter_onclick() {
    let dialogEnter = document.getElementById("dialogEnter");

    if (dialogEnter?.classList.contains("hidden")) {
        dialogEnter.classList.remove("hidden");
    } else {
        dialogEnter!.classList.add("hidden");
        return;
    }

    const scrNum: any = document.getElementById("scrNum");
    const midNum: any = document.getElementById("midNum");
    const selMarioAction: any = document.getElementById("selMarioAction");
    const selEnterX: any = document.getElementById("selEnterX");
    const selEnterY: any = document.getElementById("selEnterY");
    const selEnterFG: any = document.getElementById("selEnterFG");
    const selEnterBG: any = document.getElementById("selEnterBG");

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
    } else {
        dialogSprHeader!.classList.add("hidden");
        return;
    }

    const selSprMemory: any = document.getElementById("selSprMemory");
    const chkSprBuoy1: any = document.getElementById("chkSprBuoy1");
    const chkSprBuoy2: any = document.getElementById("chkSprBuoy2");
    
    selSprMemory.value = sprMemory.toString();
    
    if (buoyancy) {
        chkSprBuoy1.checked = true;
    } else {
        chkSprBuoy1.checked = false;
    }

    if (buoyancy2) {
        chkSprBuoy2.checked = true;
    } else {
        chkSprBuoy2.checked = false;
    }
}

function btnOtherHeader_onclick() {
    let dialogOtherHeader = document.getElementById("dialogOtherHeader");
    if (dialogOtherHeader?.classList.contains("hidden")) {
        dialogOtherHeader.classList.remove("hidden");
    } else {
        dialogOtherHeader!.classList.add("hidden");
        return;
    }

    const selLayer2ScrollingRate: any = document.getElementById("selLayer2ScrollingRate");
    const selLayer3Option: any = document.getElementById("selLayer3Option");
    const checkVerticalLevelPositioning: any = document.getElementById("checkVerticalLevelPositioning");
    const checkVerticalLevelUnknown: any = document.getElementById("checkVerticalLevelUnknown");
    const checkDisableNoYoshi: any = document.getElementById("checkDisableNoYoshi");

    selLayer2ScrollingRate.value = layer2ScrollSetting.toString();
    selLayer3Option.value = layer3Setting.toString();

    if (verticalLevelPositioning) {
        checkVerticalLevelPositioning.checked = true;
    } else {
        checkVerticalLevelPositioning.checked = false;
    }
    if (verticalLevelUnknown) {
        checkVerticalLevelUnknown.checked = true;
    } else {
        checkVerticalLevelUnknown.checked = false;
    }
    if (disableNoYoshi) {
        checkDisableNoYoshi.checked = true;
    } else {
        checkDisableNoYoshi.checked = false;
    }
}

function btnGFX_onclick() {
    let dialogGFX = document.getElementById("dialogGFX");
    
    if (dialogGFX?.classList.contains("hidden")) {
        dialogGFX.classList.remove("hidden");
    } else {
        dialogGFX!.classList.add("hidden");
        return;
    }

    const selFGBGGFX: any = document.getElementById("selFGBGGFX");
    const selSprGFX: any = document.getElementById("selSprGFX");
    
    selFGBGGFX.value = fgbgGFX.toString();
    selSprGFX.value = sprGFX.toString();
}

function getFreeSpace(dataSize: number) {
    let romData = stripHeader(fileData);
    let counter = 0;
    for (let i = 0x80000; i < romData.length; i++) {
        if (i < romData.length - 7 && 
            String.fromCharCode(romData[i], romData[i+1], romData[i+2], romData[i+3]) == "STAR") {
            let size = (romData[i+5] << 8) | romData[i+4];
            let invSize = (romData[i+7] << 8) | romData[i+6];
            if (((~size) & 0xFFFF) === (invSize & 0xFFFF)) {
                counter = 0;
                i += size + 8;
                continue;
            }                
        }
        counter++;
        if (counter === dataSize + 12) {
            if (intdiv(i, 0x8000) != intdiv(i-counter+1, 0x8000)) {
                counter = (i % 0x8000) + 1;
                continue;
            } else {
                return (i-counter+1) + 0x200;
            }
        }
    }
    return 0;
}

function getObjImage(obj: Obj) {
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
                ctx!.putImageData(data, j*16, i*16);
            }
        }

        return canvas.toDataURL('image/png');
    }

    return getObjImg(obj.objNum, obj.settings, tileset);
}

function getObjWidth(obj: Obj) {
    if (obj.objNum === 0x22 || obj.objNum === 0x23) {
        return obj.tileWidth;
    }

    return getWidth(obj.objNum, obj.settings, tileset);
}

function getObjHeight(obj: Obj) {
    if (obj.objNum === 0x22 || obj.objNum === 0x23) {
        return obj.tileHeight;
    }

    return getHeight(obj.objNum, obj.settings, tileset);
}

function render() {
    /* Rendering */

    // create view
    let stage: HTMLDivElement;
    stage = document.querySelector("#stage")!;
    
    if (stage) {
        document.querySelector("#main")!.removeChild(stage);
    }
    
    stage = document.createElement("div");
    stage.id = "stage";
    
    stage.style.backgroundColor = `rgb(${bgColor.r}, ${bgColor.g}, ${bgColor.b})`;

    stage.tabIndex = -1;
    stage.style.position = "relative";

    if (isVertical) {
        main.style.width = '100%';
        main.style.overflowX = "hidden";
        main.style.overflowY = "show";
        stage.style.height = (256 * (screenLength + 1)) + 'px';
        stage.style.width = (16 * 32) + 'px';
    } else {
        main.style.width = '100%';
        main.style.overflowX = "show";
        main.style.overflowY = "hidden";
        stage.style.height = (16 * 27) + 'px';
        stage.style.width = (256 * (screenLength + 1)) + 'px';
    }
    
    stage.onmousedown = stage_onmousedown;
    stage.onmousemove = stage_onmousemove;
    stage.onmouseup = stage_onmouseup;
    stage.onkeydown = stage_onkeydown;

    document.querySelector("#main")!.appendChild(stage);
    
    // render layer 1
    for (let i = 0; i < layer1Data.length; i++) {
        let obj = layer1Data[i];

        let myObject = document.createElement("div");
        myObject.innerHTML = hex(obj.objNum) + "<br>" + hex(obj.settings);
        myObject.className = "object layer1";
        
        //myObject.style.border = "1px solid black";
        myObject.style.position = "absolute";
        myObject.style.backgroundColor = 'chartreuse';
        if (isVertical) {
            myObject.style.top = ((256 * obj.screen) + (getX(obj) * 16)) + 'px';
            myObject.style.left = (getY(obj) * 16) + 'px';
        } else {
            myObject.style.top = (getY(obj) * 16) + 'px';
            myObject.style.left = ((256 * obj.screen) + (getX(obj) * 16)) + 'px';
        }
        myObject.style.zIndex = (i + 0x800000) + "";
        myObject.setAttribute("data-index", i.toString());
        myObject.tabIndex = -1;

        myObject.style.width = (getObjWidth(obj) * 16 ) + 'px';
        myObject.style.height = (getObjHeight(obj) * 16 ) + 'px';
        let img = getObjImage(obj);
        if (img) {
            myObject.style.border = "";
            myObject.style.backgroundColor = '';
            //myObject.innerHTML = "";
            myObject.style.backgroundImage = `url(${img})`;
        }
        myObject.style.fontSize = '8px';

        myObject.onmousedown = obj_onmousedown;
        myObject.onkeydown = obj_onkeydown;
        myObject.ondblclick = obj_ondblclick;

        stage.appendChild(myObject);      
    }


    for (let i = 0; i < layer2Data.length; i++) {
        let obj = layer2Data[i];

        let myObject = document.createElement("div");
        myObject.innerHTML = hex(obj.objNum) + "<br>" + hex(obj.settings);
        myObject.className = "object layer2";
        
        //myObject.style.border = "1px solid black";
        myObject.style.position = "absolute";
        myObject.style.backgroundColor = 'red';

        if (isVertical) {
            myObject.style.top = ((256 * obj.screen) + (getX(obj) * 16)) + 'px';
            myObject.style.left = (getY(obj) * 16) + 'px';
        } else {
            myObject.style.top = (getY(obj) * 16) + 'px';
            myObject.style.left = ((256 * obj.screen) + (getX(obj) * 16)) + 'px';
        }
        
        myObject.style.zIndex = (i) + "";
        myObject.setAttribute("data-index", i.toString());
        myObject.tabIndex = -1;

        myObject.style.width = (getObjWidth(obj) * 16 ) + 'px';
        myObject.style.height = (getObjHeight(obj) * 16 ) + 'px';
        let img = getObjImage(obj);
        if (img) {
            myObject.style.border = "";
            myObject.style.backgroundColor = '';
            //myObject.innerHTML = "";
            myObject.style.backgroundImage = `url(${img})`;
        }
        myObject.style.fontSize = '8px';

        myObject.onmousedown = obj_onmousedown;
        myObject.onkeydown = obj_onkeydown;
        myObject.ondblclick = obj_ondblclick;

        stage.appendChild(myObject);    
    }

    // render sprite
    for (let i = 0; i < sprites.length; i++) {
        let spr = sprites[i];
        let myObject = document.createElement("div");
        myObject.className = "sprite";
        myObject.innerHTML = hex(spr.spriteID) + "<br>" + hex(spr.extra);
        
        //myObject.style.border = "1px solid black";
        myObject.style.position = "absolute";
        myObject.style.backgroundColor = 'lightblue';

        const img = getSprImg(spr.spriteID, spr.extra);

        if (img) {
            myObject.style.border = "";
            myObject.style.backgroundColor = '';
            //myObject.innerHTML = "";
            myObject.style.backgroundImage = `url(${img})`;
        }

        if (isVertical) {
            myObject.style.top = ((256 * spr.screenNum) + (spr.xPosition * 16)) + 'px';
            myObject.style.left = (spr.yPosition * 16) + 'px';
        } else {
            myObject.style.top = (spr.yPosition * 16) + 'px';
            myObject.style.left = ((256 * spr.screenNum) + (spr.xPosition * 16)) + 'px';
        }

        myObject.style.zIndex = (0x1800000).toString();
        myObject.setAttribute("data-index", i.toString());
        myObject.tabIndex = -1;
        
        myObject.style.width = '16px';
        myObject.style.height = '16px';
        myObject.style.fontSize = '8px';

        myObject.ondblclick = spr_ondblclick;
        myObject.onkeydown = spr_onkeydown;
        myObject.onmousedown = obj_onmousedown;

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

function load(lvlNum: number): boolean {
    let objList: Obj[];
    let high: number, low: number, bank: number;
    let primaryLevelHeader: Array<number>;
    let secondaryLevelHeader: Array<number>;
    let currentScreen: number;
    let pointer: number;
    let lmModified: boolean;
    let lvlMode: number;
    let lunarMagicVer: string;

    // check file size
    switch (fileData.length) {
        case 524288 + 0x200:
        case 1048576 + 0x200:
        case 1572864 + 0x200:
        case 2097152 + 0x200:
        case 2621440 + 0x200:
        case 3145728 + 0x200:
        case 3670016 + 0x200:
        case 4194304 + 0x200:
        case 6291456 + 0x200:
        case 8388608 + 0x200:
            break;
        default:
            alert("Wrong File Size: " + fileData.length);
            return false;
            break;
    }

    const fileType = detectRomType(fileData, true);

    if (fileType === "Invalid") {
        alert("Unknown ROM Type");
        return false;
    }

    // check game title
    let gameTitle: string;

    gameTitle = String.fromCharCode(...fileData.slice(snes2pc(0x00ffc0, fileType), snes2pc(0x00ffc0, fileType) + 21));

    if (gameTitle !== "SUPER MARIOWORLD     ") {
        alert("Wrong game title");
        return false;
    }
    
    // expand the rom
    if (fileData.length < 1048576) {
        let result: number[];
        try {
            result = expand(fileData, 1048576, false, "", false, true)!;
        } catch (e) {
            alert("Can't expand the ROM.");
            return false;
        }
        
        fileData = new Uint8Array(result);
    }

    /* Check Lunar Magic */
    if (fileData[snes2pc(0x0FF0A0, fileType)] === 0x4C) {
        lmModified = true;
    } else {
        lmModified = false;
    }

    // Get the Lunar Magic Version
    if (lmModified) {
        const signature: string = "Lunar Magic Version ";
        
        const str = String.fromCharCode(...(fileData.slice(snes2pc(0x0FF0A0, fileType), snes2pc(0x0FF0A0, fileType) + signature.length)));

        if (str !== signature) {
            alert("Not valid ROM.");
            return false;
        }

        let verStr = "";

        for (let i = snes2pc(0x0FF0A0, fileType) + signature.length; ; i++) {
            if (fileData[i] === " ".charCodeAt(0)) {
                break;
            }

            if ("0".charCodeAt(0) <= fileData[i] && fileData[i] <= "9".charCodeAt(0)) {
                verStr += String.fromCharCode(fileData[i]);
            } else if (fileData[i] === ".".charCodeAt(0)) {
                verStr += String.fromCharCode(fileData[i]);
            } else {
                alert("Not valid ROM.");
                return false;
            }
        }

        lunarMagicVer = verStr;
    } else {
        lunarMagicVer = "0";
    }

    if (lmModified) {
        //alert("Lunar Magic Modified ROM is not supproted yet.");
        //return false;
    }  

    /* Get Layer1, Layer2, Sprite Data Pointer */

    low = fileData[snes2pc(layer1DatasTable + (3 * lvlNum) + 0, fileType)];
    high = fileData[snes2pc(layer1DatasTable + (3 * lvlNum) + 1, fileType)];
    bank = fileData[snes2pc(layer1DatasTable + (3 * lvlNum) + 2, fileType)];

    layer1DataPointer = (bank << 16) | (high << 8) | low;

    if (snes2pc(layer1DataPointer, fileType) >= fileData.length) {
        alert("Layer 1 Data Pointer is too large.");
        return false;
    }

    low = fileData[snes2pc(layer2DatasTable + (3 * lvlNum) + 0, fileType)];
    high = fileData[snes2pc(layer2DatasTable + (3 * lvlNum) + 1, fileType)];
    bank = fileData[snes2pc(layer2DatasTable + (3 * lvlNum) + 2, fileType)];

    layer2DataPointer = (bank << 16) | (high << 8) | low;       

    if (snes2pc(layer2DataPointer, fileType) >= fileData.length) {
        if ((layer2DataPointer >>> 16) != 0xFF) {
            alert("Layer 2 Data Pointer is too large.");
            return false;
        }
    }

    low = fileData[snes2pc(spriteDataTable + (2 * lvlNum) + 0, fileType)];
    high = fileData[snes2pc(spriteDataTable + (2 * lvlNum) + 1, fileType)];

    if (!lmModified) {
        bank = 0x07;
    } else {
        bank = fileData[snes2pc(0x0EF100 + lvlNum, fileType)];
    }

    spriteDataPointer = (bank << 16) | (high << 8) | low;

    if (snes2pc(spriteDataPointer, fileType) >= fileData.length) {
        alert("Sprite Data Pointer is too large.");
        return false;
    }

    /* Get Level Header */

    primaryLevelHeader = new Array(5);

    primaryLevelHeader[0] = fileData[snes2pc(layer1DataPointer + 0, fileType)];
    primaryLevelHeader[1] = fileData[snes2pc(layer1DataPointer + 1, fileType)];
    primaryLevelHeader[2] = fileData[snes2pc(layer1DataPointer + 2, fileType)];
    primaryLevelHeader[3] = fileData[snes2pc(layer1DataPointer + 3, fileType)];
    primaryLevelHeader[4] = fileData[snes2pc(layer1DataPointer + 4, fileType)];

    secondaryLevelHeader = new Array(4);
    
    secondaryLevelHeader[0] = fileData[snes2pc(0x05F000 + lvlNum, fileType)];
    secondaryLevelHeader[1] = fileData[snes2pc(0x05F200 + lvlNum, fileType)];
    secondaryLevelHeader[2] = fileData[snes2pc(0x05F400 + lvlNum, fileType)];
    secondaryLevelHeader[3] = fileData[snes2pc(0x05F600 + lvlNum, fileType)];

    /* Get Level Information */

    lvlMode = ((primaryLevelHeader[1]) & 0b11111);

    if (lvlMode >= verticalList.length || lvlMode >= layer2List.length) {
        alert("Level Mode is not valid.");
        return false;
    }
    
    screenLength = ((primaryLevelHeader[0]) & 0b11111);
    backAreaColorNum = ((primaryLevelHeader[1] >>> 5) & 0b111);
    timer = (primaryLevelHeader[3] >>> 6);
    music = ((primaryLevelHeader[2] >>> 4) & 0b111);
    itemMemory = ((primaryLevelHeader[4] >>> 6) & 0b11);
    layer3Prior = ((primaryLevelHeader[2] >>> 7) & 0b1);
    verticalScrollSetting = ((primaryLevelHeader[4] >>> 4) & 0b11);

    layer2ScrollSetting = (secondaryLevelHeader[0] >>> 4) & 0b1111;
    layer3Setting = (secondaryLevelHeader[1] >>> 6) & 0b11;
    verticalLevelPositioning = (secondaryLevelHeader[3] >>> 5) & 0b1;
    verticalLevelUnknown = (secondaryLevelHeader[3] >>> 6) & 0b1;
    disableNoYoshi = (secondaryLevelHeader[3] >>> 7) & 0b1;

    enterAction = (secondaryLevelHeader[1] >>> 3) & 0b111;
    enterScrNum = (secondaryLevelHeader[3] >>> 0) & 0b11111;
    midScrNum = (secondaryLevelHeader[2] >>> 4) & 0b1111;
    enterX = (secondaryLevelHeader[1] >>> 0) & 0b111;
    enterY = (secondaryLevelHeader[0] >>> 0) & 0b1111;
    enterBG = (secondaryLevelHeader[2] >>> 0) & 0b11;
    enterFG = (secondaryLevelHeader[2] >>> 2) & 0b11;

    isVertical = !!(verticalList[lvlMode]);

    bgPalNum = ((primaryLevelHeader[0] >>> 5) & 0b111);
    fgPalNum = ((primaryLevelHeader[3]) & 0b111);
    spPalNum = ((primaryLevelHeader[3] >> 3) & 0b111);

    fgbgGFX = primaryLevelHeader[4] & 0b1111 ;
    sprGFX = primaryLevelHeader[2] & 0b1111 ;

    // security
    if (fgbgGFX > 15) {
        fgbgGFX = 0;
    }

    if (sprGFX > 15) {
        sprGFX = 0;
    }

    levelNum = lvlNum;
    editMode = "layer1";
    isBGEdited = false;
    isLMModified = lmModified;
    levelMode = lvlMode;
    lmVer = lunarMagicVer;
    romType = fileType;
    bypassedMusic = -1;
    isTimeBypassed = false;
    sprGFXindex = -1;
    fgbgGFXindex = -1;

    /* Load Palette */

    // get palette
    pal = getPalette(bgPalNum, fgPalNum, spPalNum);

    // Get back area color
    bgColor = getBackAreaColor(backAreaColorNum);

    /* Load Graphics */
    loadGraphics();

    /* Load Map16 */
    load16x16();

    /* get secondary exits */
    secondExits = getSecondaryExits();

    /* Get Layer 2 Objects */

    isLayer2 = (layer2List[levelMode] == 1);

    bgPointer = 0;
    bgPage = 0;

    if (!isLayer2) {
        if (!isLMModified) {
            if ((layer2DataPointer >>> 16) == 0xFF) {
                bgPointer = (0x0C0000 | (layer2DataPointer & 0xFFFF));
                bgPage = getBGPage(bgPointer);
                layer2DataPointer = 0;
            }
        } else {
            let header = fileData[snes2pc(0x0EF310 + lvlNum)];
            let type = (header >>> 1) & 0b1;
            let flag = (header >>> 2) & 0b1;
            let nibble = (header >>> 4) & 0b1111;

            if ((layer2DataPointer >>> 16) == 0xFF) {
                // if default BG then
                bgPointer = (0x0C0000 | (layer2DataPointer & 0xFFFF));
                bgPage = getBGPage(bgPointer);
                layer2DataPointer = 0;
            } else {
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
    } else {
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

function loadObjects(lvlNum: number, layerDataPointer: number) {
    const objList = new Array();

    let pointer = (layerDataPointer + 5);   
    let currentScreen = 0;

    const exits = [];

    loop:
    while (fileData[snes2pc(pointer)] != 0xFF) {
        let xposition: number;
        let yposition: number;
        let newscreen: number;
        let settings: number;
        let objNum: number;  

        newscreen = (fileData[snes2pc(pointer + 0)] >>> 7);
        xposition = (fileData[snes2pc(pointer + 1)] & 0b1111);
        yposition = (fileData[snes2pc(pointer + 0)] & 0b11111);
        settings = (fileData[snes2pc(pointer + 2)]);
        objNum = (((fileData[snes2pc(pointer + 0)] >>> 5) & 0b11) << 4) | (fileData[snes2pc(pointer + 1)] >>> 4);
    
        if (newscreen) {
            currentScreen++;
        }

        if (((!(objNum === 0 && ((settings === 0x01) || (settings === 0)))) && (objNum < 0x22 || objNum > 0x2C)) && (!(objNum === 0 && settings < 0x10))) {
            let newObj: Obj;
            newObj = new Obj(objNum, xposition, yposition, settings);
            newObj.screen = currentScreen;
            objList.push(newObj);
        } else {
            if (objNum === 0) {
                if (settings == 0x00) {
                    // exits
                    let exit;
                    let scrNumber: number, isSecond: number, destLevel: number;
                    let isWaterMid: number, LMflag: number;

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
                } else if (settings == 0x01) {
                    // screen jump
                    let from: number = currentScreen;
                    let to: number = yposition;

                    currentScreen = to;

                } else {
                    if (settings === 0x02) {
                        // extended exit object
                        const scrNumber = xposition;
                        const waterFlag = ((fileData[snes2pc(pointer + 4)] >>> 3) & 0b1);
                        const secondaryExitID = (((fileData[snes2pc(pointer + 4)] >>> 4) << 9) | 
                            (((fileData[snes2pc(pointer + 4)] & 0b1) << 8) | fileData[snes2pc(pointer + 3)]));

                        alert("unimplemented");
                        unload();
                        
                        pointer += 5;
                        continue loop;

                    } else if (settings === 0x03) {
                        // extended jump object
                        alert("unimplemented");
                        unload();

                        pointer += 3;
                        continue loop;
                    } else {
                        log("Undefined extended object: " + settings.toString(16));
                        alert("Undefined extended object: " + settings.toString(16));
                        unload();
                    }
                }
            } else {
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
                            const reset = fileData[snes2pc(pointer+2)] >>> 7;
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
                            
                            const newObj: Obj = new Obj(objNum, xposition, yposition, settings);
                            
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

                            const newObj: Obj = new Obj(objNum, x, y, settings);
                            
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

                            const sprGFXi = (((fileData[snes2pc(pointer + 0)] & 0B1111) << 4) | (fileData[snes2pc(pointer+1)] & 0b1111)) - 1;
                            const fgbgGFXi = fileData[snes2pc(pointer + 2)] - 1;

                            if (objNum === 0x24) {
                                fgbgGFXindex = fgbgGFXi;
                                sprGFXindex = sprGFXi;
                                log("Old GFX Bypass : " + fgbgGFXi.toString(16) + " " + sprGFXi.toString(16));
                            } else {
                                log("Old GFX Bypass (Unknown) : " + fgbgGFXi.toString(16) + " " + sprGFXi.toString(16));    
                            }

                            pointer += 4;
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
                            } else if (rangeBits === 0b1001) {
                                m16Num = 0x4000 + m16Num;
                            } else {
                                alert("Undefined");
                                unload();
                            }
                            
                            let width: number, height: number;

                            width = (fileData[snes2pc(pointer + 2)] & 0b1111) + 1;
                            height = (fileData[snes2pc(pointer + 2)] >>> 4) + 1;
                            
                            if (mode === 0) {
                                lengthOfHeader = 5;
                            } else if (mode === 1) {
                                lengthOfHeader = 5;
                                
                                alert("Unimplmented");
                                unload();
                            } else if (mode === 3) {
                                lengthOfHeader = 6;
                                
                                alert("Unimplmented");
                                unload();
                            } else if (mode === 4) {
                                width = (fileData[snes2pc(pointer + 2)] & 0b111_1111);
                                height = fileData[snes2pc(pointer + 6)];

                                alert("Unimplmented");
                                unload();
                                
                                if (submode == 0) {
                                    lengthOfHeader = 7;
                                } else {
                                    lengthOfHeader = 8;
                                }
                            }

                            const newObj: Obj = new Obj(objNum, x, y, settings);
                            
                            newObj.screen = currentScreen;
                            
                            newObj.tileNum = m16Num;
                            newObj.tileWidth = width;
                            newObj.tileHeight = height;
                            
                            objList.push(newObj);

                            log("Direct Map16 tile (B): 0x" + m16Num.toString(16));

                            pointer += lengthOfHeader;
                            continue loop;
                        }
                        break;
                    default:
                        log("Undefined object: " + objNum.toString(16));
                        alert("Undefined object: " + objNum.toString(16));
                        unload();
                        break;
                }
            }
            
        }

        pointer += 3;
    }

    return [objList, exits];


}

function loadSprites() {
    const spriteHeader = fileData[snes2pc(spriteDataPointer)];

    buoyancy = spriteHeader >>> 7;  
    buoyancy2 = (spriteHeader >>> 6) & 1; 
    sprMemory = (spriteHeader >>> 0) & 0b11111; 
    
    let pointer = (spriteDataPointer + 1);

    sprites = [];

    while (fileData[snes2pc(pointer)] != 0xFF) {
        let xPosition: number, yPosition: number;
        let spriteID: number;
        let extra: number;
        let screenNum: number;

        yPosition = (((fileData[snes2pc(pointer+0)]) & 1) << 4) | ((fileData[snes2pc(pointer+0)]) >> 4);
        xPosition = (fileData[snes2pc(pointer+1)]) >>> 4;
        spriteID = (fileData[snes2pc(pointer+2)]);
        extra = (((fileData[snes2pc(pointer+0)]) >>> 2) & 0b11);
        screenNum = ((fileData[snes2pc(pointer+0)] >>> 1) & 1) << 4 | (fileData[snes2pc(pointer+1)] & 0b1111);

        sprites.push({
            xPosition: xPosition,
            yPosition: yPosition,
            spriteID: spriteID,
            extra: extra,
            screenNum: screenNum,
        });

        pointer += 3;
    }
}

function readPal(addr: number, index: number = 0) {
    return fileData[snes2pc((addr+((index*2))+1))] << 8 | fileData[snes2pc(addr+(index*2))];
}

function getPalette(bgPalNum: number, fgPalNum: number, spPalNum: number) {
    let palette: number[][];
    let addr: number;
    let data: number;

    // reset palette array
    palette = new Array(16);

    for (let i = 0; i < palette.length; i++) {
        palette[i] = new Array(16);
        for (let j = 0; j < palette[i].length; j++) {
            palette[i][j] = 0;
        }
        palette[i][0] = 0;
        palette[i][1] = 0b11111_11111_11111;
    }

    // get background palette
    addr = (0x00b0b0 + (0x18 * bgPalNum));
    for (let i = 0; i < 0xC; i++) {
        const data = readPal(addr, i);
        if (i < 6) {
            palette[0][2 + i] = data;
        } else {
            palette[1][(i - 6) + 2] = data;
        }
    }

    // fg palette
    addr = (0x00b190 + (0x18 * fgPalNum));
    for (let i = 0; i < 0xC; i++) {
        const data = readPal(addr, i);
        if (i < 6) {
            palette[2][2 + i] = data;
        } else {
            palette[3][(i - 6) + 2] = data;
        }
    }

    // sprite palette
    addr = (0x00b318 + (0x18 * spPalNum));
    for (let i = 0; i < 0xC; i++) {
        const data = readPal(addr, i);
        if (i < 6) {
            palette[0xe][2 + i] = data;
        } else {
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
            } else {
                palette[i][(j - 6) + 2] = data;
            }
        }
    }
    
    // animated color palette
    addr = (0x00b60c + (0x2 * 0));
    data = readPal(addr);
    palette[6][4] = data;
    
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
        const addr = (0x00B674 + (0xE * ((k+2)-2)));    

        for (let i = 0; i < 0x7; i++) {
            const data = readPal(addr, i);
            
            palette[2 + k][9 + i] = data;
            palette[9 + k][9 + i] = data;
        }      
    }

    /* Convert palettes */

    let pal: RGB[][] = new Array(16);

    for (let i = 0; i < 16; i++) {
        pal[i] = new Array(16);
        for (let j = 0; j < 16; j++) {
            let r: number, g: number, b: number;
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

function getCompressedGraphicsAddr(index: number) {
    return snes2pc(((fileData[snes2pc(0x00b9f6 + index)]) << 16) |
        ((fileData[snes2pc(0x00b9c4 + index)]) << 8) | fileData[snes2pc(0x00b992 + index)]);
}

function loadGraphics() {
    let fg1gfx: number[], fg2gfx: number[], bggfx: number[], fg3gfx: number[];
    let sp1gfx: number[], sp2gfx: number[], sp3gfx: number[], sp4gfx: number[];

    // get tileset
    tileset = tilesetList[fgbgGFX];

    /* Get Level's graphics number */
    fg1 = fileData[snes2pc((0xA92B) + (4*fgbgGFX) + 0)];
    fg2 = fileData[snes2pc((0xA92B) + (4*fgbgGFX) + 1)];
    bg  = fileData[snes2pc((0xA92B) + (4*fgbgGFX) + 2)];
    fg3 = fileData[snes2pc((0xA92B) + (4*fgbgGFX) + 3)];

    sp1 = fileData[snes2pc((spriteGfxTable) + (4*sprGFX + 0))];
    sp2 = fileData[snes2pc((spriteGfxTable) + (4*sprGFX + 1))];
    sp3 = fileData[snes2pc((spriteGfxTable) + (4*sprGFX + 2))];
    sp4 = fileData[snes2pc((spriteGfxTable) + (4*sprGFX + 3))];

    /* Get Compressed Graphics and Decompress */

    // FG/BG graphics;
    
    fg1gfx = decompress_lz2(fileData.slice(getCompressedGraphicsAddr(fg1)));

    fg2gfx = decompress_lz2(fileData.slice(getCompressedGraphicsAddr(fg2)));

    bggfx  = decompress_lz2(fileData.slice(getCompressedGraphicsAddr(bg )));

    fg3gfx = decompress_lz2(fileData.slice(getCompressedGraphicsAddr(fg3)));

    // Sprite Graphics

    sp1gfx = decompress_lz2(fileData.slice(getCompressedGraphicsAddr(sp1)));

    sp2gfx = decompress_lz2(fileData.slice(getCompressedGraphicsAddr(sp2)));

    sp3gfx = decompress_lz2(fileData.slice(getCompressedGraphicsAddr(sp3)));

    sp4gfx = decompress_lz2(fileData.slice(getCompressedGraphicsAddr(sp4)));

    /* Convert Graphics */

    fg1bmp = convertGraphics(fg1gfx);
    fg2bmp = convertGraphics(fg2gfx);
    fg3bmp = convertGraphics(fg3gfx);
    bgbmp  = convertGraphics(bggfx);

    sp1bmp = convertGraphics(sp1gfx);
    sp2bmp = convertGraphics(sp2gfx);
    sp3bmp = convertGraphics(sp3gfx);
    sp4bmp = convertGraphics(sp4gfx);
}

function getSecondaryExits(): SecondExit[] {
    const secondaryExits: SecondExit[] = new Array();

    for (let i = 0; i < 512; i++) {
        let header1: number, header2: number, header3: number, header4: number;

        const exit = new SecondExit();
        
        header1 = fileData[snes2pc(0x05F800 + i)];
        header2 = fileData[snes2pc(0x05FA00 + i)];
        header3 = fileData[snes2pc(0x05FC00 + i)];
        header4 = fileData[snes2pc(0x05FE00 + i)];

        let dest = (((header4 >>> 3) & 0b1) << 8) | header1;
        const bg = header2 >>> 6;
        const fg = (header2 >>> 4) & 0b11;
        const y = header2 & 0b1111;
        const x = header3 >>> 5;
        const scrNum = header3 & 0b11111;
        const action = header4 & 0b111;
        
        if (!isLMModified) {
            dest = (((levelNum >>> 8) & 1) << 8) | header1;
        }

        exit.dest = dest;
        exit.bg = bg;
        exit.fg = fg;
        exit.x = x;
        exit.y = y;
        exit.scrNum = scrNum;
        exit.action = action;

        secondaryExits.push(exit);
    }
    return secondaryExits;  
}

function load16x16() {
    let blocks: Tile[] = new Array(512);
    let bgBlocks: Tile[] = new Array(512);

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
    } else if (tileset == 1) {
        getMap16(0x073, 0x0FF, 0x0DBC00, blocks);
        getMap16(0x107, 0x110, 0x0DC068, blocks);
        getMap16(0x153, 0x16D, 0x0DC0B8, blocks);
    } else if (tileset == 2) {
        getMap16(0x073, 0x0FF, 0x0DC800, blocks);
        getMap16(0x107, 0x110, 0x0DCC68, blocks);
        getMap16(0x153, 0x16D, 0x0DCCB8, blocks);
    } else if (tileset == 3) {
        getMap16(0x073, 0x0FF, 0x0DD400, blocks);
        getMap16(0x107, 0x110, 0x0DD868, blocks);
        getMap16(0x153, 0x16D, 0x0DD8B8, blocks);        
    } else if (tileset == 4) {
        getMap16(0x073, 0x0FF, 0x0DE300, blocks);
        getMap16(0x107, 0x110, 0x0DE768, blocks);
        getMap16(0x153, 0x16D, 0x0DE7B8, blocks);        
    }

    map16 = blocks;
    bgTiles = bgBlocks;  
}

function getMap16(start: number, end: number, tblAddr: number, blocks: (number | Tile)[]) {
    for (let i = 0; i <= end-start; i++) {
        // YXPCCCTT
        let tile = new Tile();

        tile.upleft = new TilePart();
        tile.upright = new TilePart();
        tile.lowleft = new TilePart();
        tile.lowright = new TilePart();

        const col = [tile.upleft, tile.lowleft, tile.upright, tile.lowright];
        
        for (let j = 0; j < col.length; j++) {
            const part = col[j];

            part.gfx = ((fileData[snes2pc(tblAddr + (i*8+(j*2+1)))] & 0b11) << 8) | fileData[snes2pc(tblAddr + (i*8+(j*2)))];       
            part.xflip = (((fileData[snes2pc(tblAddr + (i*8+(j*2+1)))] >> 6) & 0b1));
            part.yflip = (((fileData[snes2pc(tblAddr + (i*8+(j*2+1)))] >> 7) & 0b1));
            part.prior = (((fileData[snes2pc(tblAddr + (i*8+(j*2+1)))] >> 5) & 0b1));
            part.pal = (((fileData[snes2pc(tblAddr + (i*8+(j*2+1)))] >> 2) & 0b111));
        }

        blocks[start+i] = tile;

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

function stone_like_image(objNum: number, settings: number, tileset: number = 0, topLeftBlock = 0x131, topCenterBlock = 0x131, topRightBlock = 0x131,
midLeftBlock = 0x131, midCenterBlock = 0x131, midRightBlock = 0x131, btmLeftBlock = 0x131, btmCenterBlock = 0x131, btmRightBlock = 0x131) {
    const canvas: HTMLCanvasElement = document.createElement("canvas") as HTMLCanvasElement;

    const height = getHeight(objNum, settings, tileset);
    const width = getWidth(objNum, settings, tileset);
    
    canvas.width = width * 16;
    canvas.height = height * 16; 

    const ctx = canvas.getContext("2d");

    ctx!.putImageData(stone_like_image_real(objNum, settings, tileset, topLeftBlock, topCenterBlock, topRightBlock, 
        midLeftBlock, midCenterBlock, midRightBlock, btmLeftBlock, btmCenterBlock, btmRightBlock), 0, 0);

    return canvas.toDataURL('image/png');
}

function stone_like_image_real(objNum: number, settings: number, tileset: number = 0, topLeftBlock = 0x131, topCenterBlock = 0x131, topRightBlock = 0x131,
midLeftBlock = 0x131, midCenterBlock = 0x131, midRightBlock = 0x131, btmLeftBlock = 0x131, btmCenterBlock = 0x131, btmRightBlock = 0x131) {

    const topLeft = getMap16TileImg(topLeftBlock);
    const topCenter = getMap16TileImg(topCenterBlock);
    const topRight = getMap16TileImg(topRightBlock);
    const midLeft = getMap16TileImg(midLeftBlock);
    const midCenter = getMap16TileImg(midCenterBlock);
    const midRight = getMap16TileImg(midRightBlock);
    const btmLeft = getMap16TileImg(btmLeftBlock);
    const btmCenter = getMap16TileImg(btmCenterBlock);
    const btmRight = getMap16TileImg(btmRightBlock);

    const canvas: HTMLCanvasElement = document.createElement("canvas") as HTMLCanvasElement;

    const height = getHeight(objNum, settings, tileset);
    const width = getWidth(objNum, settings, tileset);
    
    canvas.width = width * 16;
    canvas.height = height * 16; 

    const ctx = canvas.getContext("2d");

    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            ctx!.putImageData(midCenter, j * 16, i * 16);
        }
    }
    
    ctx!.putImageData(topLeft, 0, 0);
    ctx!.putImageData(topRight, (width-1) * 16, 0);
    ctx!.putImageData(btmLeft, 0, (height - 1) * 16);
    ctx!.putImageData(btmRight, (width-1) * 16, (height - 1) * 16);

    for (let i = 1; i < width - 1; i++) {
        ctx!.putImageData(topCenter, i * 16, 0);
        ctx!.putImageData(btmCenter, i * 16, (height - 1) * 16);
    }

    for (let i = 1; i < height - 1; i++) {
        ctx!.putImageData(midLeft, 0, i * 16);
        ctx!.putImageData(midRight, (width - 1) * 16, i * 16);
    }

    return ctx!.getImageData(0, 0, canvas.width, canvas.height);
}

function grass_like_image(objNum: number, settings: number, tileset: number = 0, leftBlock = 0x131, centerBlock = 0x131, rightBlock = 0x131) {
    const canvas: HTMLCanvasElement = document.createElement("canvas") as HTMLCanvasElement;

    const height = getHeight(objNum, settings, tileset);
    const width = getWidth(objNum, settings, tileset);

    canvas.width = width * 16;
    canvas.height = height * 16; 

    const ctx = canvas.getContext("2d");

    ctx!.putImageData(grass_like_image_real(objNum, settings, tileset, leftBlock, centerBlock, rightBlock), 0, 0);

    return canvas.toDataURL('image/png');
}

function grass_like_image_real(objNum: number, settings: number, tileset: number = 0, leftBlock = 0x131, centerBlock = 0x131, rightBlock = 0x131) {
    const canvas: HTMLCanvasElement = document.createElement("canvas") as HTMLCanvasElement;

    const height = getHeight(objNum, settings, tileset);
    const width = getWidth(objNum, settings, tileset);

    const left = getMap16TileImg(leftBlock);
    const center = getMap16TileImg(centerBlock);
    const right = getMap16TileImg(rightBlock);

    canvas.width = width * 16;
    canvas.height = height * 16; 

    const ctx = canvas.getContext("2d");

    for (let i = 0; i < height; i++) {
        ctx!.putImageData(left, 0, i * 16);
        ctx!.putImageData(right, (width-1)*16, i * 16);

        for (let j = 1; j < width - 1; j++) {
            ctx!.putImageData(center, j * 16, i * 16);
        }
    }  

    return ctx!.getImageData(0, 0, canvas.width, canvas.height);
}

function grass_like_image2(objNum: number, settings: number, tileset: number = 0, leftBlock = 0x131, centerBlock = 0x131, rightBlock = 0x131) {
    const canvas: HTMLCanvasElement = document.createElement("canvas") as HTMLCanvasElement;

    const height = getHeight(objNum, settings, tileset);
    const width = getWidth(objNum, settings, tileset);

    const left = getMap16TileImg(leftBlock);
    const center = getMap16TileImg(centerBlock);
    const right = getMap16TileImg(rightBlock);

    canvas.width = width * 16;
    canvas.height = height * 16; 

    const ctx = canvas.getContext("2d");

    for (let i = 0; i < height; i++) {
        ctx!.putImageData(right, (width-1)*16, i * 16);
        ctx!.putImageData(left, 0, i * 16);
        
        for (let j = 1; j < width - 1; j++) {
            ctx!.putImageData(center, j * 16, i * 16);
        }
    }

    

    return canvas.toDataURL('image/png');
}

function bone_like_image(objNum: number, settings: number, tileset: number = 0, topBlock = 0x131, midBlock = 0x131, btmBlock = 0x131) {
    const canvas: HTMLCanvasElement = document.createElement("canvas") as HTMLCanvasElement;

    const height = getHeight(objNum, settings, tileset);
    const width = getWidth(objNum, settings, tileset);

    const top = getMap16TileImg(topBlock);
    const mid = getMap16TileImg(midBlock);
    const btm = getMap16TileImg(btmBlock);

    canvas.width = width * 16;
    canvas.height = height * 16; 

    const ctx = canvas.getContext("2d");

    for (let j = 0; j < width; j++) {
        ctx!.putImageData(top, j * 16, 0);
        ctx!.putImageData(btm, j * 16, (height-1)*16);

        for (let i = 1; i < height - 1; i++) {
            ctx!.putImageData(mid, j * 16, i * 16);
        }
    }


    return canvas.toDataURL('image/png');
}

function pipe_like_image(objNum: number, settings: number, tileset: number, topLeftBlock = 0x131, topRightBlock = 0x131, btmLeftBlock = 0x131, btmRightBlock = 0x131) {
    const canvas: HTMLCanvasElement = document.createElement("canvas") as HTMLCanvasElement;

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
        ctx!.putImageData(btmleft, 0, j * 16);
        ctx!.putImageData(btmright, 16, j * 16);
    }

    ctx!.putImageData(topleft, 0, 0);
    ctx!.putImageData(topright, 16, 0);         

    return canvas.toDataURL('image/png'); 
}

function bridge_like_image(objNum: number, settings: number, tileset: number = 0, topBlock: number = 0x131, btmBlock: number = 0x131) {
    const canvas: HTMLCanvasElement = document.createElement("canvas") as HTMLCanvasElement;

    const width = getWidth(objNum, settings, tileset);
    const height = getHeight(objNum, settings, tileset);

    const top = getMap16TileImg(topBlock);
    const bottom = getMap16TileImg(btmBlock);

    canvas.width = 16 * width;
    canvas.height = 16 * height;

    const ctx = canvas.getContext("2d");

    for (let i = 0; i < width; i++) {
        ctx!.putImageData(top, i * 16, 0);
        ctx!.putImageData(bottom, i * 16, 16);

    } 

    return canvas.toDataURL('image/png');
}

function single_block_image(objNum: number, settings: number, tileset: number = 0, m16Num: number = 0x131) {
    const canvas: HTMLCanvasElement = document.createElement("canvas") as HTMLCanvasElement;

    const width = getWidth(objNum, settings, tileset);
    const height = getHeight(objNum, settings, tileset);

    canvas.width = 16 * width;
    canvas.height = 16 * height;

    const ctx = canvas.getContext("2d");

    let top = getMap16TileImg(m16Num);

    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            ctx!.putImageData(top, i*16, j*16);
        }
    }

    return canvas.toDataURL('image/png');
}

function undefined_obj_image(objNum: number, settings: number, tileset: number = 0) {
    const canvas: HTMLCanvasElement = document.createElement("canvas") as HTMLCanvasElement;

    const width = getWidth(objNum, settings, tileset);
    const height = getHeight(objNum, settings, tileset);

    canvas.width = 16 * width;
    canvas.height = 16 * height;

    const ctx = canvas.getContext("2d");

    let top = getMap16TileImg(0x131);

    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            ctx!.putImageData(top, i*16, j*16);
        }
    }

    return canvas.toDataURL('image/png');
}

function rev_normal_slope_image(objNum: number, settings: number, tileset: number = 0, topLeftBlock: number = 0x131, topRightBlock: number = 0x131, btmLeftBlock: number = 0x131, btmRightBlock: number = 0x131, btmBlock: number = 0x131) {
    const canvas: HTMLCanvasElement = document.createElement("canvas") as HTMLCanvasElement;
    
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
        ctx!.putImageData(topLeft, (i * 2) * 16, i * 16);
        ctx!.putImageData(topRight, (i * 2 + 1) * 16, i * 16);
        ctx!.putImageData(btmLeft, (i * 2) * 16, (i + 1) * 16);
        ctx!.putImageData(btmRight, (i * 2 + 1) * 16, (i + 1) * 16);
        
        
        for (let j = 0; j < i; j++) {
            ctx!.putImageData(btm, (i*2 + 0) * 16, j * 16);
            ctx!.putImageData(btm, (i*2 + 1) * 16, j * 16);
        }
    }

    return canvas.toDataURL('image/png');
}

function rev_normal_slope_2_image(objNum: number, settings: number, tileset: number = 0, topLeftBlock: number = 0x131, topRightBlock: number = 0x131, btmLeftBlock: number = 0x131, btmRightBlock: number = 0x131, btmBlock: number = 0x131) {
    const canvas: HTMLCanvasElement = document.createElement("canvas") as HTMLCanvasElement;
    
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
        ctx!.putImageData(topRight, ((width-1)-(i*2)) * 16, i * 16);
        ctx!.putImageData(topLeft,  (((width-1)-(i*2))-1) * 16, i * 16);
        ctx!.putImageData(btmRight,  (((width-1)-(i*2))) * 16, (i+1) * 16);
        ctx!.putImageData(btmLeft,  (((width-1)-(i*2))-1) * 16, (i+1) * 16);
        
        /*   
        for (let j = 0; j < i; j++) {
            ctx!.putImageData(btm, (i*2 + 0) * 16, j * 16);
            ctx!.putImageData(btm, (i*2 + 1) * 16, j * 16);
        }
        */

        for (let j = 0; j < i; j++) {
            ctx!.putImageData(btm, ((width-1)-(i*2)) * 16, j*16);
            ctx!.putImageData(btm, (((width-1)-(i*2))-1) * 16, j*16);
        }
    }
    

    return canvas.toDataURL('image/png');
}

function normal_slope_image(objNum: number, settings: number, tileset: number = 0, topLeftBlock: number = 0x131, topRightBlock: number = 0x131, btmLeftBlock: number = 0x131, btmRightBlock: number = 0x131, btmBlock: number = 0x131) {
    const canvas: HTMLCanvasElement = document.createElement("canvas") as HTMLCanvasElement;
    
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
        ctx!.putImageData(topLeft, (i * 2) * 16, i * 16);
        ctx!.putImageData(topRight, (i * 2 + 1) * 16, i * 16);
        ctx!.putImageData(btmLeft, (i * 2) * 16, (i + 1) * 16);
        ctx!.putImageData(btmRight, (i * 2 + 1) * 16, (i + 1) * 16);
        
        for (let j = (i + 1) + 1; j < height; j++) {
            ctx!.putImageData(btm, (i*2 + 0) * 16, j * 16);
            ctx!.putImageData(btm, (i*2 + 1) * 16, j * 16);
        }
        
    }

    return canvas.toDataURL('image/png');
}

function steep_slope_image(objNum: number, settings: number, tileset: number = 0, topBlock: number = 0x131, midBlock: number = 0x131, btmBlock: number = 0x131) {
    const canvas: HTMLCanvasElement = document.createElement("canvas") as HTMLCanvasElement;
    
    const width = getWidth(objNum, settings, tileset);
    const height = getHeight(objNum, settings, tileset);

    const top = getMap16TileImg(topBlock);
    const mid = getMap16TileImg(midBlock);
    const btm = getMap16TileImg(btmBlock);

    canvas.width = 16 * width;
    canvas.height = 16 * height;

    const ctx = canvas.getContext("2d");

    for (let i = 0; i < width; i++) {
        ctx!.putImageData(top, i*16, i*16);
        ctx!.putImageData(mid, i*16, (i+1)*16);

        for (let j = i+2; j < height; j++) {
            ctx!.putImageData(btm, i*16, j*16);
        }
    }    


    return canvas.toDataURL('image/png');
}

function rev_steep_slope_image(objNum: number, settings: number, tileset: number = 0, topBlock: number = 0x131, midBlock: number = 0x131, btmBlock: number = 0x131) {
    const canvas: HTMLCanvasElement = document.createElement("canvas") as HTMLCanvasElement;
    
    const width = getWidth(objNum, settings, tileset);
    const height = getHeight(objNum, settings, tileset);

    const top = getMap16TileImg(topBlock);
    const mid = getMap16TileImg(midBlock);
    const btm = getMap16TileImg(btmBlock);

    canvas.width = 16 * width;
    canvas.height = 16 * height;

    const ctx = canvas.getContext("2d");

    for (let i = 0; i < width; i++) {
        
        ctx!.putImageData(top, i*16, i*16);
        ctx!.putImageData(mid, i*16, (i+1)*16);

        for (let j = 0; j < i; j++) {
            ctx!.putImageData(btm, i*16, j*16);
        }
    }    


    return canvas.toDataURL('image/png');
}

function rev_steep_slope_2_image(objNum: number, settings: number, tileset: number = 0, topBlock: number = 0x131, midBlock: number = 0x131, btmBlock: number = 0x131) {
    const canvas: HTMLCanvasElement = document.createElement("canvas") as HTMLCanvasElement;
    
    const width = getWidth(objNum, settings, tileset);
    const height = getHeight(objNum, settings, tileset);

    const top = getMap16TileImg(topBlock);
    const mid = getMap16TileImg(midBlock);
    const btm = getMap16TileImg(btmBlock);

    canvas.width = 16 * width;
    canvas.height = 16 * height;

    const ctx = canvas.getContext("2d");

    for (let i = 0; i < width; i++) {
        
        
        ctx!.putImageData(top, ((width-1)-i)*16, (i+0)*16);
        ctx!.putImageData(mid, ((width-1)-i)*16, (i+1)*16);

        
        for (let j = 0; j < i; j++) {
            ctx!.putImageData(btm, ((width-1)-i)*16, j*16);
        }
        
    }    


    return canvas.toDataURL('image/png');
}

function very_steep_slope_image(objNum: number, settings: number, tileset: number = 0, topBlock: number = 0x131, midBlock: number = 0x131, btmBlock: number = 0x131, dirtBlock: number = 0x131) {
    const canvas: HTMLCanvasElement = document.createElement("canvas") as HTMLCanvasElement;
    
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
        ctx!.putImageData(top, i*16, ((i*2)+0) * 16);
        ctx!.putImageData(mid, i*16, ((i*2)+1) * 16);
        ctx!.putImageData(btm, i*16, ((i*2)+2) * 16);
        for (let j = ((i*2)+3); j < height; j++) {
            ctx!.putImageData(dirt, i*16, j*16);
        }
    }

    return canvas.toDataURL('image/png');
}

function gradual_slope_image(objNum: number, settings: number, tileset: number = 0, 
    firstBlock = 0x131, secondBlock = 0x131, thirdBlock = 0x131, forthBlock = 0x131,
    firstDownBlock = 0x131, secondDownBlock = 0x131, thirdDownBlock = 0x131, forthDownBlock = 0x131,
    dirtBlock = 0x131
) {
    const canvas: HTMLCanvasElement = document.createElement("canvas") as HTMLCanvasElement;
    
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
        ctx!.putImageData(first, (i*4+0)*16, (i)*16);
        ctx!.putImageData(second, (i*4+1)*16, (i)*16);
        ctx!.putImageData(third, (i*4+2)*16, (i)*16);
        ctx!.putImageData(forth, (i*4+3)*16, (i)*16);
        ctx!.putImageData(firstDown, (i*4+0)*16, (i+1)*16);
        ctx!.putImageData(secondDown, (i*4+1)*16, (i+1)*16);
        ctx!.putImageData(thirdDown, (i*4+2)*16, (i+1)*16);
        ctx!.putImageData(forthDown, (i*4+3)*16, (i+1)*16);
        
        for (let j = i+2; j < height; j++) {
            ctx!.putImageData(dirt, (i*4+0)*16, j * 16);
            ctx!.putImageData(dirt, (i*4+1)*16, j * 16);
            ctx!.putImageData(dirt, (i*4+2)*16, j * 16);
            ctx!.putImageData(dirt, (i*4+3)*16, j * 16);
        }
        
    }    


    return canvas.toDataURL('image/png');

}

function getSprImg(sprNum: number = 0, extra: number = 0) {
    switch (sprNum) {
        default: 
            {
                const result1 = getSpr8x8Img(0x0, 0x9);
                const result2 = getSpr8x8Img(0x1, 0x9);
                const result3 = getSpr8x8Img(0x10, 0x9);
                const result4 = getSpr8x8Img(0x11, 0x9);

                const canvas: HTMLCanvasElement = document.createElement("canvas") as HTMLCanvasElement;

                canvas.width = 16;
                canvas.height = 16;

                const ctx = canvas.getContext("2d");

                ctx!.putImageData(result1, 0, 0);
                ctx!.putImageData(result2, 8, 0);
                ctx!.putImageData(result3, 0, 8);
                ctx!.putImageData(result4, 8, 8);

                return canvas.toDataURL('image/png');
            }
            break;
    }

}

function getFg8x8Img(index: number = 0, palette: number = 0) {
    index = index % 0x200;

    const canvas: HTMLCanvasElement = document.createElement("canvas") as HTMLCanvasElement;

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
        default:
            throw new Error();
            break;
    }
  
    const i = index % 128;

    const bitmap = gfx[i];

    let r: number, g: number, b: number;
        
    for (let j = 0; j < 64; j++) {
        const color = pal[palette][bitmap[j]];            
        let r: number, g: number, b: number;
            
        r = color.r
        g = color.g
        b = color.b

        ctx!.fillStyle = `rgb(${r}, ${g}, ${b})`;

        ctx!.fillRect(j % 8, intdiv(j, 8), 1, 1);
    }  

    return ctx!.getImageData(0, 0, 8, 8);
}

function getSpr8x8Img(index: number = 0, palette: number = 0) {
    index = index % 0x200;

    const canvas: HTMLCanvasElement = document.createElement("canvas") as HTMLCanvasElement;

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
            gfx = sp3bmp;;
            break;
        case 3:
            gfx = sp4bmp;;
            break;
        default:
            throw new Error();
            break;
    }
  
    const i = index % 128;

    const bitmap = gfx[i];

    let r: number, g: number, b: number;
        
    for (let j = 0; j < 64; j++) {
        const color = pal[palette][bitmap[j]];            
        let r: number, g: number, b: number;
            
        r = color.r
        g = color.g
        b = color.b

        ctx!.fillStyle = `rgb(${r}, ${g}, ${b})`;

        ctx!.fillRect(j % 8, intdiv(j, 8), 1, 1);
    }  

    return ctx!.getImageData(0, 0, 8, 8);
}

function getObjImg(objNum: number, settings: number, tileset: number = 0) {
    const canvas: HTMLCanvasElement = document.createElement("canvas") as HTMLCanvasElement;

    const width = getWidth(objNum, settings, tileset);
    const height = getHeight(objNum, settings, tileset);

    canvas.width = 16 * width;
    canvas.height = 16 * height;

    const ctx = canvas.getContext("2d");
    if (objNum === 0x22 || objNum === 0x23) {
        // Map 16 Direct Tile
    } else if (objNum === 0x12) {
        const type = ((settings >>> 0) & 0b1111);
        if (type == 3) {
            return normal_slope_image(objNum, settings, tileset, 0x1A0, 0x1A5, 0x1E6, 0x1E0, 0x3F);
        } else if (type === 4) {
            return steep_slope_image(objNum, settings, tileset, 0x1AF, 0x1E4, 0x3F);
        } else if (type === 5) {
            return gradual_slope_image(objNum, settings, tileset, 0x182, 0x187, 0x18C, 0x191, 0x1E6, 0x1E6, 0x1DB, 0x1DC, 0x3F);
        } else if (type === 6) {
            return rev_normal_slope_image(objNum, settings, tileset, 0x1EE, 0x1F0, 0x1c6, 0x1c7, 0x165);
        } else if (type === 8) {
            return rev_steep_slope_image(objNum, settings, tileset, 0x1EC, 0x1C4, 0x165);
        } else if (type === 9) {
            return rev_steep_slope_2_image(objNum, settings, tileset, 0x1ed ,0x1c5, 0x165);
        } else if (type === 7) {
            return rev_normal_slope_2_image(objNum, settings, tileset, 0x1F0, 0x1EF, 0x1C8, 0x1C9, 0x165);
        }
    } else if (objNum === 0x00 && settings == 0x47) {
        // Door
        return bone_like_image(objNum, settings, tileset, 0x1F, 0x20, 0x20);
    } else if (objNum === 0x00 && settings == 0x81) {
        // weed
        return bone_like_image(objNum, settings, tileset, 0xC9, 0xCA, 0xCA);
    } else if (objNum === 0x00 && settings == 0x81) {
        // line guide end 1
        return grass_like_image(objNum, settings, tileset, 0x96, 0x97, 0x97);
    } else if (objNum === 0x00 && settings == 0x48) {
        // Blue Door
        return bone_like_image(objNum, settings, tileset, 0x27, 0x28, 0x28);
    } else if (objNum === 0x00 && settings == 0x44) {
        // Left slope triangle
        return bone_like_image(objNum, settings, tileset, 0x1b4, 0x1eb, 0x1eb);
    } else if (objNum === 0x00 && settings == 0x45) {
        // Right slope triangle
        return bone_like_image(objNum, settings, tileset, 0x1b5, 0x1eb, 0x1eb);
    } else if (objNum === 0x00 && settings == 0x91) {
        return bone_like_image(objNum, settings, tileset, 0x1aa, 0x1e2, 0x1e2);
    } else if (objNum === 0x00 && settings == 0x92) {
        return bone_like_image(objNum, settings, tileset, 0x1af, 0x1e4, 0x1e4);
    } else if (objNum === 0x00 && settings == 0x41) {
        // Dragon Coin
        return bone_like_image(objNum, settings, tileset, 0x2d, 0x2e, 0x2e);
    } else if (objNum === 0x0 && settings == 0x10) {
        // Small Door
        return single_block_image(objNum, settings, tileset, 0x1f);
    } else if (objNum === 0x0 && settings == 0x13) {
        // left dirt
        return single_block_image(objNum, settings, tileset, 0x42);
    } else if (objNum === 0x0 && settings == 0x14) {
        // right dirt
        return single_block_image(objNum, settings, tileset, 0x43);
    } else if (objNum === 0x0 && settings == 0x11) {
        // invisible 1-UP question block
        return single_block_image(objNum, settings, tileset, 0x22);
    } else if (objNum === 0x0 && settings == 0x28) {
        // TURN BLOCK WITH FLOWER
        return single_block_image(objNum, settings, tileset, 0x117);
    } else if (objNum === 0x0 && settings == 0x29) {
        // turn block with feather
        return single_block_image(objNum, settings, tileset, 0x118);
    } else if (objNum === 0x0 && settings == 0x2A) {
        // TURN BLOCK WITH star
        return single_block_image(objNum, settings, tileset, 0x119);
    } else if (objNum === 0x0 && settings == 0x2B) {
        // TURN BLOCK WITH vine
        return single_block_image(objNum, settings, tileset, 0x11a);
    } else if (objNum === 0x0 && settings == 0x2C) {
        // TURN BLOCK WITH MULTIPLE COINS
        return single_block_image(objNum, settings, tileset, 0x11b);
    } else if (objNum === 0x0 && settings == 0x2D) {
        // TURN BLOCK WITH coin
        return single_block_image(objNum, settings, tileset, 0x11c);
    } else if (objNum === 0x0 && settings == 0x2E) {
        // TURN BLOCK WITH NOTHING
        return single_block_image(objNum, settings, tileset, 0x129);
    } else if (objNum === 0x0 && settings == 0x2F) {
        // TURN BLOCK WITH POW
        return single_block_image(objNum, settings, tileset, 0x11d);
    } else if (objNum === 0x0 && settings == 0x12) {
        // invisible note block
        return single_block_image(objNum, settings, tileset, 0x23);
    } else if (objNum === 0x0 && settings == 0x19) {
        // invisible 1up point 1
        return single_block_image(objNum, settings, tileset, 0x6f);
    } else if (objNum === 0x0 && settings == 0x1A) {
        // invisible 1up point 2
        return single_block_image(objNum, settings, tileset, 0x70);
    } else if (objNum === 0x0 && settings == 0x1B) {
        // invisible 1up point 3
        return single_block_image(objNum, settings, tileset, 0x71);
    } else if (objNum === 0x0 && settings == 0x1C) {
        // invisible 1up point 4
        return single_block_image(objNum, settings, tileset, 0x72);
    } else if (objNum === 0x0 && settings == 0x15) {
        // invisible small door
        return single_block_image(objNum, settings, tileset, 0x27);
    } else if (objNum === 0x0 && settings == 0x87) {
        // green ! block
        return single_block_image(objNum, settings, tileset, 0x16a);
    } else if (objNum === 0x0 && settings == 0x40) {
        // glass block
        return single_block_image(objNum, settings, tileset, 0x12c);
    } else if (objNum === 0x0 && settings == 0x20) {
        // always turn block
        return single_block_image(objNum, settings, tileset, 0x48);
    } else if (objNum === 0x0 && (settings == 0x21 || settings == 0x22)) {
        if (settings === 0x21) {          
            return single_block_image(objNum, settings, tileset, 0x36);
        } else {   
            return single_block_image(objNum, settings, tileset, 0x37);
        }
    } else if (objNum === 0x0 && settings == 0x23) {
        // note block with item
        return single_block_image(objNum, settings, tileset, 0x111);
    } else if (objNum === 0x0 && settings == 0x24) {
        // on / off block
        return single_block_image(objNum, settings, tileset, 0x112);
    } else if (objNum === 0x0 && settings == 0x25) {
        // directional coins block
        return single_block_image(objNum, settings, tileset, 0x114);
    } else if (objNum === 0x0 && settings == 0x26) {
        // another note block
        return single_block_image(objNum, settings, tileset, 0x115);
    } else if (objNum === 0x0 && settings == 0x27) {
        // note block with always jumping
        return single_block_image(objNum, settings, tileset, 0x116);
    } else if (objNum === 0x0 && settings == 0x1D) {
        // Red Berry
        return single_block_image(objNum, settings, tileset, 0x45);
    } else if (objNum === 0x0 && settings == 0x1E) {
        // Peach Berry
        return single_block_image(objNum, settings, tileset, 0x46);
    } else if (objNum === 0x0 && settings == 0x1F) {
        // Green Berry
        return single_block_image(objNum, settings, tileset, 0x47);
    } else if (objNum === 0x0 && settings == 0x18) {
        // Moon
        return single_block_image(objNum, settings, tileset, 0x6e);
    } else if (objNum === 0x0 && settings == 0x68) {
        return single_block_image(objNum, settings, tileset, 0x91);
    } else if (objNum === 0x0 && settings == 0x69) {
        return single_block_image(objNum, settings, tileset, 0x92);
    } else if (objNum === 0x0 && settings == 0x6A) {
        return single_block_image(objNum, settings, tileset, 0x96);
    } else if (objNum === 0x0 && settings == 0x6B) {
        return single_block_image(objNum, settings, tileset, 0x97);
    } else if (objNum === 0x0 && settings == 0x6C) {
        return single_block_image(objNum, settings, tileset, 0x9a);
    } else if (objNum === 0x0 && settings == 0x6D) {
        return single_block_image(objNum, settings, tileset, 0x9b);
    } else if (objNum === 0x0 && settings == 0x6E) {
        return single_block_image(objNum, settings, tileset, 0x9f);
    } else if (objNum === 0x0 && settings == 0x6F) {
        return single_block_image(objNum, settings, tileset, 0xa0);
    } else if (objNum === 0x0 && settings == 0x5b) {
        return single_block_image(objNum, settings, tileset, 0x93);
    } else if (objNum === 0x0 && settings == 0x5c) {
        return single_block_image(objNum, settings, tileset, 0x94);
    } else if (objNum === 0x0 && settings == 0x5d) {
        return single_block_image(objNum, settings, tileset, 0x95);
    } else if (objNum === 0x0 && settings == 0x5e) {
        return single_block_image(objNum, settings, tileset, 0x96);
    } else if (objNum === 0x0 && settings == 0x51) {
        return single_block_image(objNum, settings, tileset, 0x76);
    } else if (objNum === 0x0 && settings == 0x52) {
        return single_block_image(objNum, settings, tileset, 0x77);
    } else if (objNum === 0x0 && settings == 0x53) {
        return single_block_image(objNum, settings, tileset, 0x78);
    } else if (objNum === 0x0 && settings == 0x54) {
        return single_block_image(objNum, settings, tileset, 0x79);
    } else if (objNum === 0x0 && settings == 0x88) {
        return single_block_image(objNum, settings, tileset, 0xc1);
    } else if (objNum === 0x0 && settings == 0x89) {
        return single_block_image(objNum, settings, tileset, 0xc2);
    } else if (objNum === 0x0 && settings == 0x60) {
        return single_block_image(objNum, settings, tileset, 0x1fe);
    } else if (objNum === 0x0 && settings == 0x4B) {
        return single_block_image(objNum, settings, tileset, 0x107);
    } else if (objNum === 0x0 && settings == 0x4C) {
        return single_block_image(objNum, settings, tileset, 0x108);
    } else if (objNum === 0x0 && settings == 0x57) {
        // switch palace tile
        return single_block_image(objNum, settings, tileset, 0x73);
    } else if (objNum === 0x0 && settings == 0x58) {
        // switch palace tile
        return single_block_image(objNum, settings, tileset, 0x74);
    } else if (objNum === 0x0 && settings == 0x59) {
        // switch palace tile
        return single_block_image(objNum, settings, tileset, 0x75);
    }  else if (objNum === 0x0 && settings == 0x5A) {
        // switch palace tile
        return single_block_image(objNum, settings, tileset, 0x76);
    } else if (objNum === 0x0 && settings == 0x97) {
        // switch palace tile
        return single_block_image(objNum, settings, tileset, 0x110);
    } else if (objNum === 0x0 && settings == 0x2D) {
        // COIN BLOCK
        return single_block_image(objNum, settings, tileset, 0x11c);
    } else if (objNum === 0xD) {
        // Cement Block
        return single_block_image(objNum, settings, tileset, 0x130);
    } else if (objNum === 0x1) {
        // Water
        return single_block_image(objNum, settings, tileset, 0x2);
    } else if (objNum === 0x2) {
        // Invisible coin blocks
        return single_block_image(objNum, settings, tileset, 0x21);
    } else if (objNum === 0x3) {
        // Invisible note blocks
        return single_block_image(objNum, settings, tileset, 0x23);
    } else if (objNum === 0x4) {
        // Invisible POW coins
        return single_block_image(objNum, settings, tileset, 0x29);
    } else if (objNum === 0x5) {
        // Coin
        return single_block_image(objNum, settings, tileset, 0x2b);
    } else if (objNum === 0x6) {
        // Dirt
        return single_block_image(objNum, settings, tileset, 0x44);
    } else if (objNum === 0x7) {
        // underground water
        return single_block_image(objNum, settings, tileset, 0x3);
    } else if (objNum === 0x8) {
        // note blocks
        return single_block_image(objNum, settings, tileset, 0x113);
    } else if (objNum === 0xB) {
        // blue blocks
        return single_block_image(objNum, settings, tileset, 0x12e);
    } else if (objNum === 0xC) {
        // plant block
        return single_block_image(objNum, settings, tileset, 0x12f);
    } else if (objNum === 0xE) {
        // brown block
        return single_block_image(objNum, settings, tileset, 0x132);
    } else if (objNum === 0x16) {
        // purple coins
        return single_block_image(objNum, settings, tileset, 0x2c);
    } else if (objNum === 0xA) {
        // COIN ? BLOCK
        return single_block_image(objNum, settings, tileset, 0x124);
    } else if (objNum === 0x9) {
        // Turn Block
        return single_block_image(objNum, settings, tileset, 0x11e);
    } else if (objNum === 0x17) {
        // Cloud or Rope
        if ((settings & 0b11110000) === 0) {
            return single_block_image(objNum, settings, tileset, 0x105);
        } else {
            return single_block_image(objNum, settings, tileset, 0x106);
        }
    } else if (objNum === 0x00 && settings === 0x16) { 
        return single_block_image(objNum, settings, tileset, 0x29);
    } else if (objNum === 0x00 && settings === 0x55) {
        // line guide end 1
        return bone_like_image(objNum, settings, tileset, 0x96, 0x97, 0x97)
    } else if (objNum === 0x00 && settings === 0x56) {
        // line guide end 2
        return grass_like_image(objNum, settings, tileset, 0x98, 0x99, 0x99)
    } else if (objNum === 0x1C) {
        // Bridge
        return bridge_like_image(objNum, settings, tileset, 0x26, 0x144)
    } else if (objNum === 0x00 && settings === 0x2B) {
        // 1UP turn block
        return single_block_image(objNum, settings, tileset, 0x11a);
    } else if (objNum === 0x00 && settings === 0x8E) {
        // Yellow ! block
        return single_block_image(objNum, settings, tileset, 0x16b);
    } else if (objNum === 0x00 && settings === 0x17) {
        // Bouns star block
        return single_block_image(objNum, settings, tileset, 0x12d);
    } else if (objNum === 0x00 && settings === 0x36) {
        // Yoshi ? block
        return single_block_image(objNum, settings, tileset, 0x126);
    } else if (objNum === 0x00 && settings === 0x30) {
        // flower question block
        return single_block_image(objNum, settings, tileset, 0x11f);
    } else if (objNum === 0x00 && settings === 0x31) {
        // feather question block
        return single_block_image(objNum, settings, tileset, 0x120);
    } else if (objNum === 0x00 && settings === 0x32) {
        // star question block
        return single_block_image(objNum, settings, tileset, 0x121);
    } else if (objNum === 0x00 && settings === 0x33) {
        // star 2 question block
        return single_block_image(objNum, settings, tileset, 0x122);
    } else if (objNum === 0x00 && settings === 0x34) {
        // multiple coins question block
        return single_block_image(objNum, settings, tileset, 0x123);
    } else if (objNum === 0x00 && settings === 0x35) {
        // key / wings question block
        return single_block_image(objNum, settings, tileset, 0x125);
    } else if (objNum === 0x00 && settings === 0x37) {
        // turtle ? block
        return single_block_image(objNum, settings, tileset, 0x127);
    } else if (objNum === 0x00 && settings === 0x38) {
        // turtle ? block 2
        return single_block_image(objNum, settings, tileset, 0x128);
    } else if (objNum === 0x00 && settings === 0x39) {
        // mario 3 style block with feather
        return single_block_image(objNum, settings, tileset, 0x12a);
    } else if (objNum === 0x00 && settings === 0x3A) {
        return single_block_image(objNum, settings, tileset, 0x1de);
    } else if (objNum === 0x00 && settings === 0x3B) {
        return single_block_image(objNum, settings, tileset, 0x1e0);
    } else if (objNum === 0x00 && settings === 0x3C) {
        return single_block_image(objNum, settings, tileset, 0x1e2);
    } else if (objNum === 0x00 && settings === 0x3D) {
        return single_block_image(objNum, settings, tileset, 0x1e4);
    } else if (objNum === 0x00 && settings === 0x3E) {
        return single_block_image(objNum, settings, tileset, 0x1ec);
    } else if (objNum === 0x00 && settings === 0x3F) {
        return single_block_image(objNum, settings, tileset, 0x1ed);
    } else if (objNum === 0x00 && settings === 0x70) {
        // bit of canvas
        return grass_like_image(objNum, settings, tileset, 0x84, 0x85, 0x85);
    } else if (objNum === 0x00 && settings === 0x75) {
        // canvas tile 1
        return single_block_image(objNum, settings, tileset, 0x7D);
    } else if (objNum === 0x00 && settings === 0x76) {
        // canvas tile 2
        return single_block_image(objNum, settings, tileset, 0x7E);
    } else if (objNum === 0x00 && settings === 0x77) {
        // canvas tile 3
        return single_block_image(objNum, settings, tileset, 0x7F);
    } else if (objNum === 0x00 && settings === 0x78) {
        // canvas tile 4
        return single_block_image(objNum, settings, tileset, 0x80);
    } else if (objNum === 0x00 && settings === 0x79) {
        // canvas tile 5
        return single_block_image(objNum, settings, tileset, 0x81);
    } else if (objNum === 0x00 && settings === 0x7A) {
        // canvas tile 6
        return single_block_image(objNum, settings, tileset, 0x82);
    } else if (objNum === 0x00 && settings === 0x7B) {
        // canvas tile 7
        return single_block_image(objNum, settings, tileset, 0x83);
    } else if (objNum === 0x00 && settings === 0x7c) {
        // bit of canvas 2
        return bone_like_image(objNum, settings, tileset, 0x81, 0x84, 0x84);
    } else if (objNum === 0x00 && settings === 0x7d) {
        // bit of canvas 3
        return bone_like_image(objNum, settings, tileset, 0x82, 0x85, 0x85);
    } else if (objNum === 0x00 && settings === 0x7e) {
        // bit of canvas 4
        return bone_like_image(objNum, settings, tileset, 0x83, 0x86, 0x86);
    } else if (objNum === 0x00 && settings === 0x86) {
        // goal sign
        return stone_like_image(objNum, settings, tileset, 0x66, 0x67, 0x67, 0x68, 0x69, 0x69, 0x68, 0x69, 0x69);
    } else if (objNum === 0x00 && settings === 0x61) {
        // ghost house clock
        return stone_like_image(objNum, settings, tileset, 0x97, 0x98, 0x99, 0x9a, 0x9b, 0x9c, 0x9d, 0x9e, 0x9f);
    } else if (objNum === 0x00 && settings === 0x4A) {
        // touch net
        return stone_like_image(objNum, settings, tileset, 0x10, 0x11, 0x12, 0x13, 0x0b, 0x15, 0x16, 0x17, 0x18);
    } else if (objNum === 0x00 && settings === 0x66) {
        let topleft = getMap16TileImg(0x25);
        let topcenterleft = getMap16TileImg(0x25)
        let topcenterright = getMap16TileImg(0x7A)
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

        ctx!.putImageData(topleft, 0, 0);
        ctx!.putImageData(topcenterleft, 16, 0);
        ctx!.putImageData(topcenterright, 32, 0);
        ctx!.putImageData(topright, 48, 0);

        ctx!.putImageData(midtopleft, 0, 16);
        ctx!.putImageData(midtopcenterleft, 16, 16);
        ctx!.putImageData(midtopcenterright, 32, 16);
        ctx!.putImageData(midtopright, 48, 16);

        ctx!.putImageData(midbtmleft, 0, 32);
        ctx!.putImageData(midbtmcenterleft, 16, 32);
        ctx!.putImageData(midbtmcenterright, 32, 32);
        ctx!.putImageData(midbtmright, 48, 32);

        ctx!.putImageData(bottomleft, 0, 48);
        ctx!.putImageData(bottomcenterleft, 16, 48);
        ctx!.putImageData(bottomcenterright, 32, 48);
        ctx!.putImageData(bottomright, 48, 48);

        return canvas.toDataURL('image/png'); 
    } else if (objNum === 0x00 && settings === 0x67) {
        let topleft = getMap16TileImg(0x7E);
        let topcenterleft = getMap16TileImg(0x7F)
        let topcenterright = getMap16TileImg(0x25)
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

        ctx!.putImageData(topleft, 0, 0);
        ctx!.putImageData(topcenterleft, 16, 0);
        ctx!.putImageData(topcenterright, 32, 0);
        ctx!.putImageData(topright, 48, 0);

        ctx!.putImageData(midtopleft, 0, 16);
        ctx!.putImageData(midtopcenterleft, 16, 16);
        ctx!.putImageData(midtopcenterright, 32, 16);
        ctx!.putImageData(midtopright, 48, 16);

        ctx!.putImageData(midbtmleft, 0, 32);
        ctx!.putImageData(midbtmcenterleft, 16, 32);
        ctx!.putImageData(midbtmcenterright, 32, 32);
        ctx!.putImageData(midbtmright, 48, 32);

        ctx!.putImageData(bottomleft, 0, 48);
        ctx!.putImageData(bottomcenterleft, 16, 48);
        ctx!.putImageData(bottomcenterright, 32, 48);
        ctx!.putImageData(bottomright, 48, 48);

        return canvas.toDataURL('image/png'); 
    } else if (objNum === 0x00 && settings === 0x62) {
        return stone_like_image(objNum, settings, tileset, 0x86, 0x87, 0x25, 0x25, 0x86, 0x87, 0x25, 0x25, 0x86);
    } else if (objNum === 0x00 && settings === 0x63) {
        return stone_like_image(objNum, settings, tileset, 0x25, 0x84, 0x85, 0x84, 0x85, 0x25, 0x85, 0x25, 0x25);
    } else if (objNum === 0x00 && settings === 0x90) {
        // boss door
        return stone_like_image(objNum, settings, tileset, 0x98, 0x99, 0x99, 0x9a, 0x9b, 0x9b, 0x9c, 0x9c, 0x9c);
    } else if (objNum === 0x00 && settings === 0x4d) {
        return stone_like_image(objNum, settings, tileset, 0x7a, 0x25, 0x7b, 0x25, 0x25, 0x25, 0x7c, 0x25, 0x25);
    } else if (objNum === 0x00 && settings === 0x4e) {
        return stone_like_image(objNum, settings, tileset, 0x7e, 0x25, 0x7f, 0x25, 0x25, 0x25, 0x25, 0x25, 0x7d);
    } else if (objNum === 0x00 && settings === 0x4f) {
        return stone_like_image(objNum, settings, tileset, 0x82, 0x25, 0x25, 0x25, 0x25, 0x25, 0x80, 0x25, 0x81);
    } else if (objNum === 0x00 && settings === 0x50) {
        return stone_like_image(objNum, settings, tileset, 0x25, 0x25, 0x83, 0x25, 0x25, 0x25, 0x84, 0x25, 0x85);
    } else if (objNum === 0x00 && settings === 0x64) {
        // cobweb 1
        return stone_like_image(objNum, settings, tileset, 0x8c, 0x25, 0x8d, 0x25, 0x25, 0x25, 0x25, 0x25, 0x8e);
    } else if (objNum === 0x00 && settings === 0x65) {
        // cobweb 2
        return stone_like_image(objNum, settings, tileset, 0x90, 0x25, 0x91, 0x25, 0x25, 0x25, 0x8f, 0x25, 0x25);
    } else if (objNum === 0x00 && settings === 0x8F) {
        // ghost house window
        return stone_like_image(objNum, settings, tileset, 0xfc, 0x25, 0xfd, 0x25, 0x25, 0x25, 0xfe, 0x25, 0xff);
    } else if (objNum === 0x00 && settings === 0x7f) {
        return stone_like_image(objNum, settings, tileset, 0x166, 0x25, 0x167, 0x25, 0x25, 0x25, 0x168, 0x25, 0x169);
    } else if (objNum === 0x00 && settings === 0x8A) {
        // green switch
        return stone_like_image(objNum, settings, tileset, 0xec, 0x25, 0xed, 0x25, 0x25, 0x25, 0xee, 0x25, 0xef);
    } else if (objNum === 0x00 && settings === 0x8B) {
        // yellow switch
        return stone_like_image(objNum, settings, tileset, 0xf0, 0x25, 0xf1, 0x25, 0x25, 0x25, 0xf2, 0x25, 0xf3); 
    } else if (objNum === 0x00 && settings === 0x8C) {
        // blue switch
        return stone_like_image(objNum, settings, tileset, 0xf4, 0x25, 0xf5, 0x25, 0x25, 0x25, 0xf6, 0x25, 0xf7);
    } else if (objNum === 0x00 && settings === 0x8D) {
        // red switch
        return stone_like_image(objNum, settings, tileset, 0xf8, 0x25, 0xf9, 0x25, 0x25, 0x25, 0xfa, 0x25, 0xfb);
    } else if (objNum === 0x00 && settings === 0x93) {
        return stone_like_image(objNum, settings, tileset, 0x196, 0x25, 0x19b, 0x25, 0x25, 0x25, 0x1de, 0x25, 0x1e6);
    } else if (objNum === 0x00 && settings === 0x94) {
        return stone_like_image(objNum, settings, tileset, 0x1a0, 0x25, 0x1a5, 0x25, 0x25, 0x25, 0x1e6, 0x25, 0x1e0);
    } else if (objNum === 0x15) {
        // goal or midway
        if ((settings & 0b00001111) === 0) {
            // midway
            return stone_like_image(objNum, settings, tileset, 0x2f, 0x25, 0x32, 0x30, 0x25, 0x33, 0x31, 0x25, 0x34);            
        } else {
            // goal
            return stone_like_image(objNum, settings, tileset, 0x39, 0x25, 0x3c, 0x3a, 0x25, 0x3d, 0x3b, 0x25, 0x3e);
        }
    } else if (objNum === 0x00 && settings === 0x46) {
        // midway
        return grass_like_image(objNum, settings, tileset, 0x35, 0x38, 0x38);
    } else if (objNum === 0x00 && settings === 0x42) {
        // slope 1
        return grass_like_image(objNum, settings, tileset, 0x1D8, 0x1DA, 0x1DA);
    } else if (objNum === 0x00 && settings === 0x43) {
        // slope 2
        return grass_like_image(objNum, settings, tileset, 0x1DB, 0x1DC, 0x1DC);
    } else if (objNum === 0x21) {
        // long ground
        return bone_like_image(objNum, settings, tileset, 0x100, 0x3f, 0x3f);

    } else if (objNum === 0x14) {
        // ground
        return bone_like_image(objNum, settings, tileset, 0x100, 0x3f, 0x3f);
    } else if (objNum === 0x18) {
        // water
        return bone_like_image(objNum, settings, tileset, 0x0, 0x2, 0x2);
    } else if (objNum === 0x19) {
        // underground water
        return bone_like_image(objNum, settings, tileset, 0x1, 0x3, 0x3);
    } else if (objNum === 0x1A) {
        // lava
        return bone_like_image(objNum, settings, tileset, 0x4, 0x5, 0x5);
    } else if (objNum === 0x1B) {
        // Net
        return bone_like_image(objNum, settings, tileset, 0x8, 0xb, 0xb);
    } else if (objNum === 0x1D) {
        // bottom Net
        return bone_like_image(objNum, settings, tileset, 0xb, 0xb, 0xe);
    } else if (objNum === 0x20) {
        return grass_like_image(objNum, settings, tileset, 0x156, 0x157, 0x158);
    } else if (objNum === 0x13) {
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
            } else if (type === 1) {
                mid = (0x41);
            } else if (type === 2) {
                mid = (0x6);
            } else if (type === 4) {
                mid = (0x14B);
            } else if (type === 6) {
                mid = (0x14C);
            }

            return single_block_image(objNum, settings, tileset, mid);

        } else if (type === 8 || type === 7 || type === 3 || type === 5 || type === 9 || type === 10) {
            // right ground
            const width = 1;
            const height = getHeight(objNum, settings, tileset);

            let top;
            let mid;

            if (type === 8) {
                top = (0x103);
                mid = (0x41);
            } else if (type === 7) {
                top = (0x101);
                mid = (0x40);
            } else if (type === 3) {
                top = (0x145);
                mid = (0x14B);
            } else if (type === 5) {
                top = (0x148);
                mid = (0x14C);
            } else if (type === 9) {
                top = (0x1B6);
                mid = (0x14B);

            } else if (type === 10) {
                top = (0x1B7);
                mid = (0x14C);
            }

            return bone_like_image(objNum, settings, tileset, top, mid, mid);

        } else if (type === 13 || type === 11 || type === 14 || type === 12) {
            const width = 1;
            const height = getHeight(objNum, settings, tileset);   

            let top;
            let mid;
            let btm;

            if (type === 11 || type === 12) {
                top = (0x145);
                mid = (0x14B);
                btm = (0x1E2);
            } else if (type === 13 || type === 14) {
                top = (0x148);
                mid = (0x14C);
                btm = (0x1E4);
            } 
            
            if (type === 12) {
                top = (0x14B);
            } else if (type === 14) {
                top = (0x14C);
            }
            
            return bone_like_image(objNum, settings, tileset, top, mid, btm);
        }
    } else if (objNum === 0xF) {
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
            ctx!.putImageData(midleft, 0, j * 16);
            ctx!.putImageData(midright, 16, j * 16);
        }

        if (type === 1) {
            topleft = getMap16TileImg(0x137);
            topright = getMap16TileImg(0x138);
        } else if (type === 2) {
            topleft = getMap16TileImg(0x139);
            topright = getMap16TileImg(0x13A);
            btmleft = getMap16TileImg(0x139);
            btmright = getMap16TileImg(0x13A);
        } else if (type === 4) {
            btmleft = getMap16TileImg(0x137);
            btmright = getMap16TileImg(0x138);
        }

        if (type === 0 || type === 1) {       
            ctx!.putImageData(topleft, 0, 0);
            ctx!.putImageData(topright, 16, 0);         
        } else if (type === 2) {
            ctx!.putImageData(topleft, 0, 0);
            ctx!.putImageData(topright, 16, 0);         
            ctx!.putImageData(btmleft, 0, (height - 1) * 16);
            ctx!.putImageData(btmright, 16, (height - 1) * 16);
        } else if (type === 3 || type === 4) {
            ctx!.putImageData(btmleft, 0, (height - 1) * 16);
            ctx!.putImageData(btmright, 16, (height - 1) * 16);
        }

        return canvas.toDataURL('image/png'); 
    } else if (objNum === 0x10) {
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
        } else if (type === 2 || type === 3) {
            return stone_like_image(objNum, settings, tileset, midtop, midtop, righttop, 0x25, 0x25, 0x25, midbtm, midbtm, rightbtm);
        }

    } else if (objNum === 0x1F) {
        // small pipe
        return bone_like_image(objNum, settings, tileset, 0x153, 0x154, 0x155);
    } else if (objNum === 0x00 && settings === 0x95) {
        return bone_like_image(objNum, settings, tileset, 0x1CA, 0x1CB, 0x1F1);
    } else if (objNum === 0x00 && settings === 0x96) {
        return bone_like_image(objNum, settings, tileset, 0x1CC, 0x1CD, 0x1F2);
    } else if (objNum === 0x11) {
        // bullet bill shooter
        const width = 1;
        const height = getHeight(objNum, settings, tileset);

        let top = getMap16TileImg(0x141);
        let mid = getMap16TileImg(0x142);
        let btm = getMap16TileImg(0x143);

        canvas.width = width * 16;
        canvas.height = height * 16; 

        const ctx = canvas.getContext("2d");

        ctx!.putImageData(top, 0, 0);
        ctx!.putImageData(mid, 0, 16);

        for (let j = 2; j < height; j++) {
            ctx!.putImageData(btm, 0, j * 16);
        }

        return canvas.toDataURL('image/png'); 

    } else if (objNum === 0x1E) {
        // net left / right

        const type = settings & 0b1111;

        if (type === 0) {
            return single_block_image(objNum, settings, tileset, 0xa);
        } else {
            return single_block_image(objNum, settings, tileset, 0xc);
        }
        
    } else if (objNum >= 0x2E || objNum <= 0x3F) {
        if (tileset === 0) {
            // plain
            if (objNum === 0x3F && ((settings >>> 4) & 0b1111) === 0) {
                // grass
                return grass_like_image(objNum, settings, tileset, 0x73, 0x74, 0x79);
            } else if (objNum === 0x3F && ((settings >>> 4) & 0b1111) === 1) {
                // grass 2
                return grass_like_image(objNum, settings, tileset, 0x7A, 0x7B, 0x80);
            } else if (objNum === 0x3F && ((settings >>> 4) & 0b1111) === 2) {
                // grass 3
                return grass_like_image(objNum, settings, tileset, 0x85, 0x86, 0x87);
            } else if (objNum === 0x3F && ((settings >>> 4) & 0b1111) === 3) {
                // grass 4
                return grass_like_image(objNum, settings, tileset, 0x88, 0x89, 0x8e);
            } else if (objNum === 0x3F && ((settings >>> 4) & 0b1111) === 4) {
                // grass 5
                return grass_like_image(objNum, settings, tileset, 0xc3, 0xc3, 0xc3);
            } else if (objNum === 0x32) {
                return single_block_image(objNum, settings, tileset, 0x16C);
            } else if (objNum === 0x38) {
                return single_block_image(objNum, settings, tileset, 0x16D);
            } else if (objNum === 0x31) {
                return single_block_image(objNum, settings, tileset, 0x165);
            } else if (objNum === 0x30) {
                return pipe_like_image(objNum, settings, tileset, 0x161, 0x162, 0x163, 0x164)
            } else if (objNum === 0x34) {
                const mode = ((settings >>> 0) & 0b1111);
                if (mode === 0) {
                    return bone_like_image(objNum, settings, tileset, 0x15F, 0x160, 0x160);
                } else if (mode === 1) {
                    return bone_like_image(objNum, settings, tileset, 0x15E, 0x15D, 0x15D);
                } else if (mode === 2) {
                    return bone_like_image(objNum, settings, tileset, 0x110, 0xC5, 0xC5);
                } else if (mode === 3) {
                    return bone_like_image(objNum, settings, tileset, 0x10F, 0xC4, 0xC4);
                }
            } else if (objNum === 0x35) {
                return bone_like_image(objNum, settings, tileset, 0x10E, 0xB8, 0xB8);
            } else if (objNum === 0x3C) {
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
                        ctx!.putImageData(pilTop, i * 16, 0);
                        ctx!.putImageData(pil, i * 16, 16);
                        ctx!.putImageData(pil, i * 16, 32);
                        ctx!.putImageData(pil, i * 16, 48);
                    } else if (i % 3 === 1) {
                        ctx!.putImageData(top, i * 16, 0);
                        ctx!.putImageData(archLeft, i * 16, 16);
                        ctx!.putImageData(emptyTile, i * 16, 32);
                        ctx!.putImageData(emptyTile, i * 16, 48);

                    } else {
                        ctx!.putImageData(top, i * 16, 0);
                        ctx!.putImageData(archRight, i * 16, 16);
                        ctx!.putImageData(archRightUnder, i * 16, 32);
                        ctx!.putImageData(archRightUnder, i * 16, 48);
                    }
                }

                ctx!.putImageData(pilTopLeft, 0, 0);
                ctx!.putImageData(pilTopRight, (width - 1) * 16, 0);

                return canvas.toDataURL('image/png');
            } else if (objNum === 0x37) {
                const mode = ((settings >>> 0) & 0b1111);

                let tile1, tile2;

                if (mode === 0) {
                    tile1 = getMap16TileImg(0xbd);
                    tile2 = getMap16TileImg(0xbe);
                } else if (mode === 1) {
                    tile1 = getMap16TileImg(0xbf);
                    tile2 = getMap16TileImg(0xc0);
                }

                for (let i = 0; i < height; i++) {
                    if (i % 2 === 0) {
                        ctx!.putImageData(tile1!, 0, i * 16);
                    } else {
                        ctx!.putImageData(tile2!, 0, i * 16);
                    }
                }

                return canvas.toDataURL('image/png');
            } else if (objNum === 0x36) {
                // big trunk
                
                const width = getWidth(objNum, settings, tileset);
                const height = getHeight(objNum, settings, tileset);

                for (let i = 0; i < width; i++) {
                    for (let j = 0; j < height; j++) {
                        if (i % 2 === 0) {
                            if (j % 2 === 0) {
                                const tile = getMap16TileImg(0xb9);
                                ctx!.putImageData(tile, i * 16, j * 16);
                            } else {
                                const tile = getMap16TileImg(0xbb);
                                ctx!.putImageData(tile, i * 16, j * 16);
                            }
                        } else {
                            if (j % 2 === 0) {
                                const tile = getMap16TileImg(0xba);
                                ctx!.putImageData(tile, i * 16, j * 16);
                            } else {
                                const tile = getMap16TileImg(0xbc);
                                ctx!.putImageData(tile, i * 16, j * 16);
                            }
                        }
                    }
                }

                return canvas.toDataURL('image/png');
            } else if (objNum === 0x3D) {
                const mode = ((settings >>> 4) & 0b1111);
                
                if (mode === 0) {
                    return single_block_image(objNum, settings, tileset, 0x93);
                } else if (mode === 1) {
                    return single_block_image(objNum, settings, tileset, 0x9c);
                }


            } else if (objNum === 0x3e) {
                const mode = ((settings >>> 0) & 0b1111);

                if (mode === 0) {
                    return bone_like_image(objNum, settings, tileset, 0x94, 0x8f, 0x8f);
                } else if (mode === 1) {
                    return bone_like_image(objNum, settings, tileset, 0x8f, 0x8f, 0x8f);
                } else if (mode === 2) {
                    return bone_like_image(objNum, settings, tileset, 0x9d, 0x98, 0x98);
                } else if (mode === 3) {
                    return bone_like_image(objNum, settings, tileset, 0x98, 0x98, 0x98);
                } else if (mode === 4) {
                    return bone_like_image(objNum, settings, tileset, 0x95, 0x90, 0x90);
                } else if (mode === 5) {
                    return bone_like_image(objNum, settings, tileset, 0x90, 0x90, 0x90);
                } else if (mode === 6) {
                    return bone_like_image(objNum, settings, tileset, 0x9e, 0x99, 0x99);
                } else if (mode === 7) {
                    return bone_like_image(objNum, settings, tileset, 0x99, 0x99, 0x99);
                }

            }
        } else if (tileset === 2) {
            // athletic
            if (objNum === 0x33) {
                // blue switch
                return single_block_image(objNum, settings, tileset, 0x16C);
            } else if (objNum === 0x34) {
                // red switch
                return single_block_image(objNum, settings, tileset, 0x16D);
            } else if (objNum === 0x37) {
                const mode = ((settings >>> 0) & 0b1111);
                if (mode === 2) {
                    return steep_slope_image(objNum, settings, tileset, 0x1CF, 0x1F4, 0x25);
                } else if (mode === 3) {
                    return steep_slope_image(objNum, settings, tileset, 0x1D0, 0x1F5, 0x25);
                }
            } else if (objNum === 0x3B) {
                const type = (settings >>> 4) & 0b1111;
                if (type === 1) {
                    return very_steep_slope_image(objNum, settings, tileset, 0x89, 0x8B, 0x25, 0x25);
                }

            } else if (objNum === 0x3A) {
                const type = (settings >>> 0) & 0b1111;
                if (type === 2) {
                    return normal_slope_image(objNum, settings, tileset, 0x8E, 0x8F, 0x25, 0x25);
                } else if (type === 3) {
                    return steep_slope_image(objNum, settings, tileset, 0x87, 0x25, 0x25);
                } else if (type === 5) {
                    return steep_slope_image(objNum, settings, tileset, 0x95, 0x25, 0x25);
                }
            } else if (objNum === 0x3c) {
                return grass_like_image(objNum, settings, tileset, 0x107, 0x108, 0x109);
            } else if (objNum === 0x3d) {
                return grass_like_image(objNum, settings, tileset, 0x73, 0x74, 0x75);
            } else if (objNum === 0x3E) {
                return grass_like_image(objNum, settings, tileset, 0x159, 0x15A, 0x15B);
            } else if (objNum === 0x3F) {
                return bone_like_image(objNum, settings, tileset, 0x15C, 0x15D, 0x15E);
            } else if (objNum === 0x39 && ((settings) & 0b1111) === 2) {
                return single_block_image(objNum, settings, tileset, 0xA2);
            } else if (objNum === 0x32) {
                return bridge_like_image(objNum, settings, tileset, 0xA3, 0x10E);
            } else if (objNum === 0x35) {
                const mode = ((settings >>> 0) & 0b1111);

                let leafLeft;
                let leafRight;

                if (mode === 0) {
                    leafLeft = getMap16TileImg(0x9A);
                    leafRight = getMap16TileImg(0x9B);
                } else if (mode === 1) {
                    leafLeft = getMap16TileImg(0x9C);
                    leafRight = getMap16TileImg(0x9D);
                } else if (mode === 2) {
                    leafLeft = getMap16TileImg(0x9E);
                    leafRight = getMap16TileImg(0x9F);
                } else if (mode === 3) {
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
                        ctx!.putImageData(btm2Left, 0, i * 16);
                        ctx!.putImageData(btm2Right, 16, i * 16);
                    } else if (i % 3 === 1) {
                        ctx!.putImageData(btm3Left, 0, i * 16);
                        ctx!.putImageData(btm3Right, 16, i * 16);
                    } else {
                        ctx!.putImageData(btm1Left, 0, i * 16);
                        ctx!.putImageData(btm1Right, 16, i * 16);
                    }
                }

                ctx!.putImageData(leafLeft!, 0, 0);
                ctx!.putImageData(leafRight!, 16, 0);
                ctx!.putImageData(topLeft, 0, 16);
                ctx!.putImageData(topRight, 16, 16);

                return canvas.toDataURL("image/png");
            } else if (objNum === 0x36) {
                const mode = ((settings >>> 4) & 0b1111);
                if (mode === 0) {
                    return single_block_image(objNum, settings, tileset, 0x10C);
                } else if (mode === 1) {
                    return single_block_image(objNum, settings, tileset, 0x10D);
                }
            } else if (objNum === 0x38) {
                const mode = ((settings >>> 4) & 0b1111);
                if (mode === 0) {
                    return single_block_image(objNum, settings, tileset, 0x92);
                } else if (mode === 1) {
                    return single_block_image(objNum, settings, tileset, 0x93);
                }
            } else if (objNum === 0x39) {
                const mode = ((settings >>> 0) & 0b1111);
                if (mode === 0) {
                    return single_block_image(objNum, settings, tileset, 0x90);
                } else if (mode === 1) {
                    return single_block_image(objNum, settings, tileset, 0x91);
                }
            }
        } else if (tileset === 4) {
            // ghost house or switch palace
            if (objNum === 0x36) {
                return single_block_image(objNum, settings, tileset, 0x15e);
            } else if (objNum === 0x35) {
                return single_block_image(objNum, settings, tileset, 0x92);
            } else if (objNum === 0x2F) {
                return single_block_image(objNum, settings, tileset, 0x82);
            } else if (objNum === 0x37 && ((settings >>> 4) & 0b1111) === 0) {
                return single_block_image(objNum, settings, tileset, 0x82);
            } else if (objNum === 0x37 && ((settings >>> 4) & 0b1111) === 2) {
                return single_block_image(objNum, settings, tileset, 0x88); 
            } else if (objNum === 0x37 && ((settings >>> 4) & 0b1111) === 1) {
                return grass_like_image(objNum, settings, tileset, 0x89, 0x8A, 0x8B); 
            } else if (objNum === 0x39 && ((settings >>> 0) & 0b1111) === 0) {
                return single_block_image(objNum, settings, tileset, 0x83);
            } else if (objNum === 0x39 && ((settings >>> 0) & 0b1111) === 2) {
                return single_block_image(objNum, settings, tileset, 0x79);
            } else if (objNum === 0x39 && ((settings >>> 0) & 0b1111) === 1) {
                return bone_like_image(objNum, settings, tileset, 0x78, 0x79, 0x79);
            } else if (objNum === 0x3A && ((settings >>> 0) & 0b1111) === 0) {
                return single_block_image(objNum, settings, tileset, 0x15F);
            } else if (objNum === 0x3A && ((settings >>> 0) & 0b1111) === 1) {
                return single_block_image(objNum, settings, tileset, 0x160);
            } else if (objNum === 0x3A && ((settings >>> 0) & 0b1111) === 2) {
                return single_block_image(objNum, settings, tileset, 0x15a);
            } else if (objNum === 0x3A && ((settings >>> 0) & 0b1111) === 3) {
                return single_block_image(objNum, settings, tileset, 0x15b);
            } else if (objNum === 0x2E) {
                return single_block_image(objNum, settings, tileset, 0x159);
            } else if (objNum === 0x38) {
                return grass_like_image(objNum, settings, tileset, 0x10A, 0x10B, 0x10C);
            } else if (objNum === 0x32) {
                return bridge_like_image(objNum, settings, tileset, 0x10E, 0xA3);
            } else if (objNum === 0x33) {
                return grass_like_image(objNum, settings, tileset, 0xA0, 0xA1, 0xA2);
            } else if (objNum === 0x30) {
                return bone_like_image(objNum, settings, tileset, 0x10F, 0xEA, 0xEA);
            } else if (objNum === 0x3B) {
                return grass_like_image(objNum, settings, tileset, 0x107, 0x108, 0x109);
            } else if (objNum === 0x3C) {
                return bone_like_image(objNum, settings, tileset, 0x153, 0x153, 0x154);
            } else if (objNum === 0x3D) {
                return bone_like_image(objNum, settings, tileset, 0x15D, 0x153, 0x153);
            } else if (objNum === 0x3E) {
                return grass_like_image(objNum, settings, tileset, 0x153, 0x153, 0x155);
            } else if (objNum === 0x3F) {
                return grass_like_image2(objNum, settings, tileset, 0x15C, 0x153, 0x153);
            } else if (objNum === 0x34) {
                const width = getWidth(objNum, settings, tileset);
                const height = getHeight(objNum, settings, tileset);

                const topLeft = getMap16TileImg(0x10A);
                const topCenter = getMap16TileImg(0x10B);
                const topRight = getMap16TileImg(0x10C);
                const col = getMap16TileImg(0x79);
                const coltop = getMap16TileImg(0x78);
                
                for (let i = 0; i < width; i++) {
                    ctx!.putImageData(topCenter, i * 16, 0);
                }

                ctx!.putImageData(topLeft, 0, 0);
                ctx!.putImageData(topRight, (width - 1) * 16, 0);

                for (let i = 0; i < width; i++) {
                    if (i % 4 === 1) {
                        for (let j = 1; j < height; j++) {
                            ctx!.putImageData(col, i * 16, j * 16);
                        }
                        ctx!.putImageData(coltop, i * 16, 16);
                    }
                }

                return canvas.toDataURL('image/png');
            } else if (objNum === 0x31) {
                const width = getWidth(objNum, settings, tileset);
                const height = getHeight(objNum, settings, tileset);

                ctx!.putImageData(stone_like_image_real(objNum, settings, tileset, 0x161, 0x10D, 0x162, 0x165, 0xC8, 0x16A, 0x16B, 0x16C, 0x16D), 0, 0);
                
                for (let i = 1; i < height - 1; i++) {
                    if (i % 2 === 1) {
                        const left = getMap16TileImg(0x163);
                        const center = getMap16TileImg(0xC7);
                        const right = getMap16TileImg(0x164);
                        
                        for (let j = 0; j < width; j++) {
                            ctx!.putImageData(center, j * 16, i * 16);
                        }

                        ctx!.putImageData(left, 0, i * 16);
                        ctx!.putImageData(right, (width - 1) * 16, i * 16);                        
                    }
                }

                return canvas.toDataURL('image/png');
            }
        } else if (tileset === 3) {
            // underground
            if (objNum === 0x34) {
                return single_block_image(objNum, settings, tileset, 0x16C);
            } else if (objNum === 0x35) {
                return single_block_image(objNum, settings, tileset, 0x16D);
            } else if (objNum === 0x39) {
                // lava
                let height, type;
                
                type = (settings >>> 0) & 0b1111;
                height = ((settings >>> 4) & 0b1111) + 1;

                if (type === 2) {
                    return normal_slope_image(objNum, settings, tileset, 0x1D4, 0x1D5, 0x1FF, 0x1FC, 0x1FF);
                } else if (type === 3) {
                    return steep_slope_image(objNum, settings, tileset, 0x1D7, 0x1FE, 0x1FF);
                }

            } else if (objNum === 0x3f) {
                return single_block_image(objNum, settings, tileset, 0x165);
            } else if (objNum === 0x3e) {
                const mode = ((settings >>> 0) & 0b1111);
                if (mode === 0) {
                    return bone_like_image(objNum, settings, tileset, 0x150, 0x150, 0x14D);
                } else if (mode === 1) {
                    return bone_like_image(objNum, settings, tileset, 0x150, 0x150, 0x150);
                } else if (mode === 2) {
                    return bone_like_image(objNum, settings, tileset, 0x151, 0x151, 0x14F);
                } else if (mode === 3) {
                    return bone_like_image(objNum, settings, tileset, 0x151, 0x151, 0x151);
                }
            } else if (objNum === 0x3C) {
                // slope
                let height, type;
                type = (settings >>> 4) & 0b1111;
                height = ((settings >>> 0) & 0b1111) + 1;

                if (type === 1) {
                    return very_steep_slope_image(objNum, settings, tileset, 0x1CC, 0x1CD, 0x1F2, 0x3F);
                }
            } else if (objNum === 0x3d) {
                return bone_like_image(objNum, settings, tileset, 0x165, 0x165, 0x14e);
            } else if (objNum === 0x3b) {
                return single_block_image(objNum, settings, tileset, 0x1ff);
            } else if (objNum === 0x3a) {
                return bone_like_image(objNum, settings, tileset, 0x159, 0x1ff, 0x1ff);
            } else if (objNum === 0x38) {
                const mode = ((settings >>> 0) & 0b1111);
                if (mode === 0) {
                    return bone_like_image(objNum, settings, tileset, 0x15a, 0x15b, 0x15b);
                } else if (mode === 1) {
                    return bone_like_image(objNum, settings, tileset, 0x1ff, 0x1ff, 0x1ff);
                }
                
            } else if (objNum === 0x36) {
                return stone_like_image(objNum, settings, tileset, 0x145, 0x100, 0x148, 0x150, 0x1F0, 0x151, 0x14D, 0x14E, 0x14F);
            }
        } else if (tileset === 1) {
            // castle
            if (objNum === 0x39) {
                // blue switch
                return single_block_image(objNum, settings, tileset, 0x16C);
            } else if (objNum === 0x3a) {
                // red switch
                return single_block_image(objNum, settings, tileset, 0x16D);
            } else if (objNum === 0x3b) {
                return bone_like_image(objNum, settings, tileset, 0x109, 0x86, 0x86);
            } else if (objNum === 0x3c) {
                return stone_like_image(objNum, settings, tileset, 0x15d, 0x15e, 0x15f, 0x160, 0x161, 0x162, 0x163, 0x164, 0x165);
            } else if (objNum === 0x3d) { 
                // escalator
                let height, type;

                type = (settings >>> 0) & 0b1111;
                height = ((settings >>> 4) & 0b1111) + 1;

                if (type === 2) {
                    return steep_slope_image(objNum, settings, tileset, 0x1CF, 0x1F4, 0x3F);    
                } else if (type === 3) {
                    return steep_slope_image(objNum, settings, tileset, 0x1D0, 0x1F5, 0X3F);
                }

            } else if (objNum === 0x3f) {
                const mode = ((settings >>> 0) & 0b1111);
                if (mode === 0) {
                    return single_block_image(objNum, settings, tileset, 0x15b);
                } else if (mode === 1) {
                    return single_block_image(objNum, settings, tileset, 0x15c);
                } else if (mode === 2) {
                    return single_block_image(objNum, settings, tileset, 0x153);
                }
            } else if (objNum === 0x3e) {
                const mode = ((settings >>> 4) & 0b1111);

                if (mode === 0) {
                    return single_block_image(objNum, settings, tileset, 0x15a);
                } else if (mode === 1) {
                    return single_block_image(objNum, settings, tileset, 0x159);
                }
            } else if (objNum === 0x37) {
                const mode = ((settings >>> 4) & 0b1111);

                if (mode === 0) {
                    return single_block_image(objNum, settings, tileset, 0x92);
                } else if (mode === 1) {
                    return single_block_image(objNum, settings, tileset, 0x93);
                }
            } else if (objNum === 0x38) {
                const mode = ((settings >>> 0) & 0b1111);
                if (mode === 0) {
                    return single_block_image(objNum, settings, tileset, 0x90);
                } else if (mode === 1) {
                    return single_block_image(objNum, settings, tileset, 0x91);
                }
            } else if (objNum === 0x34) {
                return stone_like_image(objNum, settings, tileset, 0x133, 0x25, 0x134, 0x9d, 0x25, 0x9e, 0x133, 0x25, 0x134);
            } else if (objNum === 0x35) {
                // hot wall
                
                const width = getWidth(objNum, settings, tileset);
                const height = getHeight(objNum, settings, tileset);

                for (let i = 0; i < width; i++) {
                    for (let j = 0; j < height; j++) {
                        if (i % 2 === 0) {
                            if (j % 2 === 0) {
                                const tile = getMap16TileImg(0x94);
                                ctx!.putImageData(tile, i * 16, j * 16);
                            } else {
                                const tile = getMap16TileImg(0x96);
                                ctx!.putImageData(tile, i * 16, j * 16);
                            }
                        } else {
                            if (j % 2 === 0) {
                                const tile = getMap16TileImg(0x95);
                                ctx!.putImageData(tile, i * 16, j * 16);
                            } else {
                                const tile = getMap16TileImg(0x97);
                                ctx!.putImageData(tile, i * 16, j * 16);
                            }
                        }
                    }
                }

                return canvas.toDataURL('image/png');
            } else if (objNum === 0x36) {
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

                            ctx!.putImageData(left, 0, i * 16);
                            ctx!.putImageData(centleft, 16, i * 16);
                            ctx!.putImageData(centright, 32, i * 16);
                            ctx!.putImageData(right, 48, i * 16);
                        } else {
                            const left = getMap16TileImg(0x8B);
                            const centleft = getMap16TileImg(0x168);
                            const centright = getMap16TileImg(0x169);
                            const right = getMap16TileImg(0x8C);

                            ctx!.putImageData(left, 0, i * 16);
                            ctx!.putImageData(centleft, 16, i * 16);
                            ctx!.putImageData(centright, 32, i * 16);
                            ctx!.putImageData(right, 48, i * 16);
                        }

                        const left = getMap16TileImg(0x25);
                        const centleft = getMap16TileImg(0x8d);
                        const centright = getMap16TileImg(0x8e);
                        const right = getMap16TileImg(0x25);

                        ctx!.putImageData(left, 0, (height - 1) * 16);
                        ctx!.putImageData(centleft, 16, (height - 1) * 16);
                        ctx!.putImageData(centright, 32, (height - 1) * 16);
                        ctx!.putImageData(right, 48, (height - 1) * 16);
                    }
                    
                    return canvas.toDataURL('image/png');
                } else if (mode === 1) {
                    const width = getWidth(objNum, settings, tileset);
                    const height = getHeight(objNum, settings, tileset);

                    for (let i = 0; i < height; i++) {
                        if (i % 2 === 0) {
                            const left = getMap16TileImg(0x8B);
                            const centleft = getMap16TileImg(0x168);
                            const centright = getMap16TileImg(0x169);
                            const right = getMap16TileImg(0x8C);

                            ctx!.putImageData(left, 0, i * 16);
                            ctx!.putImageData(centleft, 16, i * 16);
                            ctx!.putImageData(centright, 32, i * 16);
                            ctx!.putImageData(right, 48, i * 16);
                        } else {
                            const left = getMap16TileImg(0x89);
                            const centleft = getMap16TileImg(0x166);
                            const centright = getMap16TileImg(0x167);
                            const right = getMap16TileImg(0x8A);

                            ctx!.putImageData(left, 0, i * 16);
                            ctx!.putImageData(centleft, 16, i * 16);
                            ctx!.putImageData(centright, 32, i * 16);
                            ctx!.putImageData(right, 48, i * 16);
                        }

                        const left = getMap16TileImg(0x25);
                        const centleft = getMap16TileImg(0x87);
                        const centright = getMap16TileImg(0x88);
                        const right = getMap16TileImg(0x25);

                        ctx!.putImageData(left, 0, 0);
                        ctx!.putImageData(centleft, 16, 0);
                        ctx!.putImageData(centright, 32, 0);
                        ctx!.putImageData(right, 48, 0);
                    }
                    
                    return canvas.toDataURL('image/png');
                }
            }

        }
    }

    return undefined_obj_image(objNum, settings, tileset);
}

function getBackAreaColor(backAreaColorNum: number) {
    let temp: number;
    let r: number, g: number, b: number;
    let bgColor: RGB;

    temp = fileData[snes2pc(0x00B0A0+(backAreaColorNum*2+1))] << 8 | fileData[snes2pc((0x00B0A0)+(backAreaColorNum*2))];

    // convert bgColor
    r = (temp & 0b11111) * 8;
    g = ((temp >> 5) & 0b11111) * 8;
    b = ((temp >> 10)  & 0b11111) * 8;

    bgColor = new RGB();
    bgColor.r = r;
    bgColor.g = g;
    bgColor.b = b;

    return bgColor;
}

function getBGPage(bgPointer: number): number {
    let bgPage: number;
    if (bgPointer < 0xCE8FE) {
        bgPage = 0;
    } else {
        bgPage = 1;
    }
    return bgPage;
}

function loadBG(bgPointer: number): Nullable<number[]> {
    let temp: number[], temp1: number[];
    let bgData: Nullable<number[]>;

    if (!bgPointer) {
        return null;
    }

    temp = decompress_rle1(fileData.slice(snes2pc(bgPointer)));
    
    temp1 = new Array(temp.length);

    for (let i = 0; i < temp1.length; i++) {
        temp1[i] = 0;
    }
    
    let counter: number;
    
    counter = 0;
            
    for (let i = 0; i < Math.floor(temp.length / 2); i++) {
        if (i % 16 == 0 && i != 0) {
            counter += 16;
        }
        temp1[counter] = temp[i];
        counter++;
    }

    temp = temp.slice(Math.floor(temp.length / 2));

    counter = 0;
    for (let i = 0; i < temp.length; i++) {
        if (i % 16 == 0) {
            counter += 16;
        }
        temp1[counter] = temp[i];
        counter++;
    }

    bgData = temp1;

    return bgData;
}

function convertGraphics(org: number[]) {
    let bitmapTiles: number[][] = new Array(16 * 8);
    for (let i = 0; i < 128; i++) {
        let bitmap: number[] = new Array(64);

        for (let c = 0; c < 8; c++) {
            
            for (let k = 0; k < 8; k++) {
                bitmap[8*c+k] = ((org[(i*24)+2*c+0] >>> (7-k)) & 1) << 0;    
            }
            
            
            for (let k = 0; k < 8; k++) {
                bitmap[8*c+k] |= ((org[(i*24)+2*c+1] >>> (7-k)) & 1) << 1;    
            }
            
            /*
            
            bitmap[8*c+0] = ((org[(i*24)+2*c+0] >>> 7) & 1) << 0;
            bitmap[8*c+1] = ((org[(i*24)+2*c+0] >>> 6) & 1) << 0;
            bitmap[8*c+2] = ((org[(i*24)+2*c+0] >>> 5) & 1) << 0;
            bitmap[8*c+3] = ((org[(i*24)+2*c+0] >>> 4) & 1) << 0;
            bitmap[8*c+4] = ((org[(i*24)+2*c+0] >>> 3) & 1) << 0;
            bitmap[8*c+5] = ((org[(i*24)+2*c+0] >>> 2) & 1) << 0;
            bitmap[8*c+6] = ((org[(i*24)+2*c+0] >>> 1) & 1) << 0;
            bitmap[8*c+7] = ((org[(i*24)+2*c+0] >>> 0) & 1) << 0;
            
            
            
            bitmap[8*c+0] |= ((org[(i*24)+2*c+1] >>> 7) & 1) << 1;
            bitmap[8*c+1] |= ((org[(i*24)+2*c+1] >>> 6) & 1) << 1;
            bitmap[8*c+2] |= ((org[(i*24)+2*c+1] >>> 5) & 1) << 1;
            bitmap[8*c+3] |= ((org[(i*24)+2*c+1] >>> 4) & 1) << 1;
            bitmap[8*c+4] |= ((org[(i*24)+2*c+1] >>> 3) & 1) << 1;
            bitmap[8*c+5] |= ((org[(i*24)+2*c+1] >>> 2) & 1) << 1;
            bitmap[8*c+6] |= ((org[(i*24)+2*c+1] >>> 1) & 1) << 1;
            bitmap[8*c+7] |= ((org[(i*24)+2*c+1] >>> 0) & 1) << 1;  
            */

        }

        for (let c = 0; c < 8; c++) {
            for (let k = 0; k < 8; k++) {
                bitmap[8*c+k] |= ((org[(i*24)+16+c] >>> (7-k)) & 1) << 2;    
            }
            
            /*
            bitmap[8*c+0] |= ((org[(i*24)+16+c] >>> 7) & 1) << 2;
            bitmap[8*c+1] |= ((org[(i*24)+16+c] >>> 6) & 1) << 2;
            bitmap[8*c+2] |= ((org[(i*24)+16+c] >>> 5) & 1) << 2;
            bitmap[8*c+3] |= ((org[(i*24)+16+c] >>> 4) & 1) << 2;
            bitmap[8*c+4] |= ((org[(i*24)+16+c] >>> 3) & 1) << 2;
            bitmap[8*c+5] |= ((org[(i*24)+16+c] >>> 2) & 1) << 2;
            bitmap[8*c+6] |= ((org[(i*24)+16+c] >>> 1) & 1) << 2;
            bitmap[8*c+7] |= ((org[(i*24)+16+c] >>> 0) & 1) << 2;  
            */
        }

        bitmapTiles[i] = bitmap;
    }        
    return bitmapTiles;
}

function fileOpen(): void {
    const fileInput = document.createElement("input");
    
    fileInput.type = "file";
    fileInput.accept = ".smc";

    fileInput.onchange = function (this: any) {
        if (this.files.length != 1) {
            return;
        }

        fileName = this.files[0].name;

        const fr = new FileReader();
        
        fr.onload = function () {
            fileData = new Uint8Array(this.result as ArrayBuffer);
            let levelNum// = 0x105;
            if (levelNum === undefined) {
                try {
                    let input;
                    input = prompt("Input the level number (in hex)", "105");
                    if (!input) return;
                    levelNum = safeParseInt("0x" + input);
                } catch (e) {
                    alert("Wrong input");
                    return;
                }
            }
            let result: boolean;
            result = load(levelNum);
            if (!result) {
                return false;
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
        }

        fr.readAsArrayBuffer(this.files[0]);
    }    

    fileInput.click();
}

function getPalImage(pal: RGB[][]) {
    const canvas = document.createElement("canvas");
    canvas.width = 8 * 16 * 2;
    canvas.height = 8 * 16 * 2;

    const ctx = canvas.getContext("2d");
    for (let i = 0; i < pal.length; i++) {
        for (let j = 0; j < pal[i].length; j++) {
            let r: number, g: number, b: number;
            r = pal[i][j].r;
            g = pal[i][j].g;
            b = pal[i][j].b;
            ctx!.fillStyle = `rgb(${r}, ${g}, ${b})`;
            ctx!.fillRect(j * 8 * 2, i * 8 * 2, 8 * 2, 8 * 2);
        }
    }

    return ctx!.getImageData(0, 0, canvas.width, canvas.height);
}

function getMap16TileImg(index: number, bg: boolean = false): any {
    let canvas = document.createElement("canvas");

    canvas.style.border = "1px solid black";
    canvas.width = 16;
    canvas.height = 16;

    let ctx = canvas.getContext("2d");

    let blocks;
    
    let firstBmp, secondBmp, thirdBmp, fourthBmp;

    if (bg) {
        blocks = bgTiles;
    } else {
        blocks = map16;
    }
    

    let i: number = index;
    {
        let div: number, mod: number;
        let blockx: number, blocky: number;
        let flipx: number, flipy: number;
        let bitmap: number[][];
        let leftIndex: number, topIndex: number, index: number;

        blockx = i % 16;
        blocky = Math.floor(i / 16);

        if (typeof blocks[i] == "undefined") throw new Error('block is undefined.');



        
        const col = [blocks[i].upleft, blocks[i].upright, blocks[i].lowleft, blocks[i].lowright];

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
            } else if (div === 1) {
                bitmap = fg2bmp;
            } else if (div === 2) {
                bitmap = bgbmp;
            } else if (div === 3) {
                bitmap = fg3bmp
            } else {
                return ctx!.getImageData(0, 0, 16, 16);
            }

            for (let k = 0; k < 8; k++) {
                for (let l = 0; l < 8; l++) {
                    let r: number, g: number, b: number;

                    leftIndex = l;

                    if (flipx) {
                        leftIndex = 7-l;
                    }

                    topIndex = k;

                    if (flipy) {
                        topIndex = 7-k;
                    }

                    index = topIndex*8 + leftIndex;

                    let alpha: number = 1.0;
                    
                    if (bitmap[mod][index] === 0) {
                        alpha = 0.0;
                    }

                    r = pal[palette][bitmap[mod][index]].r;
                    g = pal[palette][bitmap[mod][index]].g;
                    b = pal[palette][bitmap[mod][index]].b;
                    
                    setPoint(k + (intdiv(j, 2)*8), l + (((j % 2))*8), r, g, b, ctx!, alpha);
                    

                }
            }
            
        }
    }
    
    return ctx!.getImageData(0, 0, 16, 16);
}

function getBG(bgData: Nullable<number[]>, bgPage: number) {
    if (bgData === null) {
        return null;        
    }

    const canvas = document.createElement("canvas");
    
    canvas.width = 32 * 16;
    canvas.height = 27 * 16;  
    
    const ctx = canvas.getContext("2d");

    for (let i = 0; i < bgData.length; i++) {
        const value = bgData[i]+(bgPage * 0x100);
        const tile = getMap16TileImg(value, true);

        const x = i % 32;
        const y = Math.floor(i / 32);

        ctx!.putImageData(tile, x * 16, y * 16);
        
    }

    return ctx!.getImageData(0, 0, canvas.width, canvas.height);
}

function getLevelBG() {
    const result = getBG(bgData, bgPage);
    if (result !== null) {
        return result;
    } else {
        return null;
    }
}

function renderBG() {
    const canvas: HTMLCanvasElement = document.createElement("canvas") as HTMLCanvasElement;
    
    canvas.width = 32 * 16;
    canvas.height = 27 * 16;

    let bgBitmap = getLevelBG();

    const ctx = canvas.getContext("2d");

    if (bgBitmap !== null) {
        ctx!.putImageData(bgBitmap, 0, 0);
    }  

    canvas.toBlob((blob: any) => {
        const url = URL.createObjectURL(blob);
        document.getElementById("stage")!.style.backgroundImage = `url(${url})`;
    }, "image/png");
}

function getWidth(objNum: number, settings: number, tileset: number = 0): number {
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
    
    let result: number = 1;

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
                result = (height - 1) * 2
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
            if (objNum == 0x30) {
                result = 2;
            } else if (objNum >= 0x31 && objNum <= 0x32) {
                result = (settings & 0b1111) + 1;
            } else if (objNum == 0x33) {
                result = ((settings & 0b1111) + 1) * 16;
            } else if (objNum == 0x34) {
                result = 1;
            } else if (objNum == 0x35) {
                result = (settings & 0b1111) + 1;
            } else if (objNum == 0x36) {
                result = 2;
            } else if (objNum == 0x37) {
                result = 1;
            } else if (objNum == 0x38) {
                result = (settings & 0b1111) + 1;
            } else if (objNum == 0x39) {
                // todo
            } else if (objNum == 0x3A) {
                // todo
            } else if (objNum == 0x3B) {
                // todo
            } else if (objNum == 0x3C) {
                result = (settings & 0b1111) * 3 + 1;
            } else if (objNum == 0x3D) {
                result = (settings & 0b1111) + 1;
            } else if (objNum == 0x3E) {
                result = 1;
            } else if (objNum == 0x3F) {
                result = (settings & 0b1111) + 1;
            }
        } else if (tileset == 1) {
            if (objNum == 0x34) {
                result = 2;
            } else if (objNum == 0x35) {
                result = ((settings & 0b1111) + 1) * 2;
            } else if (objNum == 0x36) {
                result = 4;
            } else if (objNum == 0x37) {
                result = ((settings & 0b1111) + 1);
            } else if (objNum == 0x38) {
                result = 1;
            } else if (objNum == 0x39 || objNum == 0x3A) {
                result = ((settings & 0b1111) + 1);
            } else if (objNum == 0x3B) {
                result = ((settings & 0b1111) + 1);
            } else if (objNum == 0x3C) {
                result = ((settings & 0b1111) + 1);
            } else if (objNum == 0x3D) {
                // escalator
                let height, type;
                type = (settings >>> 0) & 0b1111;
                height = ((settings >>> 4) & 0b1111) + 1;
                if (type === 2 || type === 3) {
                    result = height;
                }
            } else if (objNum == 0x3E) {
                result = ((settings & 0b1111) + 1);
            } else if (objNum == 0x3F) {
                result = 1;
            }
        } else if (tileset == 2) {
            // athletic
            if (objNum == 0x32) {
                result = ((settings & 0b1111) + 1);
            } else if (objNum == 0x33 || objNum == 0x34) {
                result = ((settings & 0b1111) + 1);
            } else if (objNum == 0x35) {
                result = 2;
            } else if (objNum == 0x36) {
                result = ((settings & 0b1111) + 1);
            } else if (objNum == 0x37) {
                let height, type;
                
                type = (settings >>> 0) & 0b1111;
                height = ((settings >>> 4) & 0b1111) + 1;

                if (type === 2) {
                    result = height;
                } else if (type === 3) {
                    result = height;
                }               
            } else if (objNum == 0x38) {
                result = ((settings & 0b1111) + 1);
            } else if (objNum == 0x39) {
                result = 1;
            } else if (objNum == 0x3A) {
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
                }
            } else if (objNum == 0x3B) {
                let height, type;
                type = (settings >>> 4) & 0b1111;
                height = ((settings >>> 0) & 0b1111) + 1;
                if (type === 1) {
                    result = height;
                }
            } else if (objNum == 0x3C) {
                result = ((settings & 0b1111) + 1);
            } else if (objNum == 0x3D) {
                result = ((settings & 0b1111) + 1);
            } else if (objNum == 0x3E) {
                result = ((settings & 0b1111) + 1);
            } else if (objNum == 0x3F) {
                result = 1;
            }
        } else if (tileset == 3) {
            // underground
            if (objNum == 0x34 || objNum == 0x35) {
                result = ((settings & 0b1111) + 1);
            } else if (objNum == 0x36) {
                result = ((settings & 0b1111) + 1);
            } else if (objNum == 0x37) {
                result = 1;
            } else if (objNum == 0x38) {
                result = 1;
            } else if (objNum == 0x39) {
                // lava
                let height, type;
                
                type = (settings >>> 0) & 0b1111;
                height = ((settings >>> 4) & 0b1111) + 1;

                if (type === 2) {
                    result = height * 2;
                } else if (type === 3) {
                    result = height;
                }

                

            } else if (objNum == 0x3A || objNum == 0x3B) {
                result = ((settings & 0b1111) + 1);
            } else if (objNum == 0x3C) {
                // slope
                let height, type;
                type = (settings >>> 4) & 0b1111;
                height = ((settings >>> 0) & 0b1111) + 1;
                if (type === 1) {
                    result = height;
                }
            } else if (objNum == 0x3D) {
                result = ((settings & 0b1111) + 1);
            } else if (objNum == 0x3E) {
                result = 1;
            } else if (objNum == 0x3F) {
                result = ((settings & 0b1111) + 1);
            }
        } else if (tileset == 4) {
            if (objNum == 0x2E) {
                result = ((settings & 0b1111) + 1);
            } else if (objNum == 0x2F) {
                result = ((settings & 0b1111) + 1);
            } else if (objNum == 0x30) {
                result = ((settings & 0b1111) + 1);
            } else if (objNum == 0x31) {
                result = ((settings & 0b1111) + 1);
            } else if (objNum == 0x32) {
                result = ((settings & 0b1111) + 1);
            } else if (objNum == 0x33) {
                result = ((settings & 0b1111) + 1);
            } else if (objNum == 0x34) {
                result = ((settings & 0b1111) + 1) * 4 - 1;
            } else if (objNum == 0x35 || objNum == 0x36) {
                result = ((settings & 0b1111) + 1);
            } else if (objNum == 0x37 || objNum == 0x38) {
                result = ((settings & 0b1111) + 1); 
            } else if (objNum == 0x39 || objNum == 0x3a) {
                result = 1;
            } else if (objNum >= 0x3B && objNum <= 0x3e) {
                result = ((settings & 0b1111) + 1);
            } else if (objNum == 0x3f) {
                result = ((settings & 0b1111) + 2);
                if (result == 2) result = 1;
            }
        }
        
    }

    if (objNum === 0x13) {
        result = 1;
    }

    if (objNum === 0x14) {
        result = (settings & 0b1111) + 1
    }

    if (objNum === 0x15) {
        result = 3
    }

    if (objNum >= 0x16 && objNum <= 0x1D ) {
        result = (settings & 0b1111) + 1;
    }

    if (objNum >= 0x1E && objNum <= 0x1F ) {
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

function getHeight(objNum: number, settings: number, tileset = 0): number {
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

    let result: number = 1;

    if (objNum == 0x22 || objNum == 0x23) {
        
    } else if (objNum == 0) { 
        result = lookupTable[settings]; 
    } else if (objNum >= 0x1 && objNum <= 0x0F) {
        result = ((settings >>> 4) & 0b1111) + 1;
    } else if (objNum == 0x10) {
        result = 2;
    } else if (objNum === 0x11) {
        // bullet bill shooter
        result = ((settings >>> 4) & 0b1111) + 1;
    } else if (objNum === 0x12) {
        // slope
        let type = (settings & 0b1111);

        result = ((settings >>> 4) & 0b1111) + 2;

        if (type === 6 || type === 7 || type === 8 || type === 9) {
            result--;
        }
    } else if (objNum === 0x13) {
        // edge
        let type = (settings & 0b1111);

        result = ((settings >>> 4) & 0b1111) + 1;
        
        if (type === 11 || type === 12 || type === 13 || type === 14) {
            result++;
        }

    } else if (objNum === 0x14) {
        // ground
        result = ((settings >>> 4) & 0b1111) + 1;
    } else if (objNum === 0x15) {
        // midway point
        result = ((settings >>> 4) & 0b1111) + 1;
    } else if (objNum === 0x16) {
        // purple coins
        result = ((settings >>> 4) & 0b1111) + 1;
    } else if (objNum == 0x17) {
        result = 1;
    } else if (objNum >= 0x18 && objNum <= 0x1B ) {
        result = ((settings >>> 4) & 0b1111) + 1;
    } else if (objNum == 0x1C) {
        result = 2;
    } else if (objNum >= 0x1D && objNum <= 0x1F ) {
        result = ((settings >>> 4) & 0b1111) + 1;
    } else if (objNum == 0x20) {
        result = 1;
    } else if (objNum == 0x21) {
        result = 3;
    } else if (objNum >= 0x2E || objNum <= 0x3F) {
        // tileset spec height
        if (tileset == 0) {
            if (objNum == 0x30) {
                result = (((settings >> 4) & 0b1111) + 1);
            } else if (objNum >= 0x31 && objNum <= 0x32) {
                result = (((settings >> 4) & 0b1111) + 1);
            } else if (objNum == 0x33) {
                result = 6;
            } else if (objNum == 0x34) {
                result = ((((settings >> 4) & 0b1111) + 1));
            } else if (objNum == 0x35) {
                result = (((settings >> 4) & 0b1111) + 1);
            } else if (objNum == 0x36) {
                result = ((((settings >> 4) & 0b1111) + 1));
            } else if (objNum == 0x37) {
                result = ((((settings >> 4) & 0b1111) + 1));
            } else if (objNum == 0x38) {
                result = (((settings >> 4) & 0b1111) + 1);
            } else if (objNum == 0x39) {
                result = ((settings >>> 4) & 0b1111) + 2;
            } else if (objNum == 0x3A) {
                result = ((settings >>> 4) & 0b1111) + 4;
            } else if (objNum == 0x3B) {
                result = ((settings >>> 4) & 0b1111) + 4;
            } else if (objNum == 0x3C) {
                result = 4;
            } else if (objNum == 0x3D) {
                result = 1;
            } else if (objNum == 0x3E) {
                result = ((((settings >> 4) & 0b1111) + 1));
            } else if (objNum == 0x3F) {
                result = 1;
            }
        } else if (tileset == 1) {
            if (objNum == 0x34) {
                result = (((settings >> 4) & 0b1111) + 1)
            } else if (objNum == 0x35) {
                result = (((settings >> 4) & 0b1111) + 1) * 2;
            } else if (objNum == 0x36) {
                result = (((settings >> 4) & 0b1111) + 1) + 1;
            } else if (objNum == 0x37) {
                result = 1;
            } else if (objNum == 0x38) {
                result = (((settings >> 4) & 0b1111) + 1)
            } else if (objNum == 0x39 || objNum == 0x3A) {
                result = (((settings >> 4) & 0b1111) + 1);
            } else if (objNum == 0x3B) {
                result = 2;
            } else if (objNum == 0x3C) {
                result = (((settings >> 4) & 0b1111) + 1);
            } else if (objNum == 0x3D) {
                result = (((settings >> 4) & 0b1111) + 1) + 1;
            } else if (objNum == 0x3E) {
                result = 1;
            } else if (objNum == 0x3F) {
                result = (((settings >> 4) & 0b1111) + 1);
            }
        } else if (tileset == 2) {
            if (objNum == 0x32) {
                result = 2;
            } else if (objNum == 0x33 || objNum == 0x34) {
                result = (((settings >> 4) & 0b1111) + 1);
            } else if (objNum == 0x35) {
                result = (((settings >> 4) & 0b1111) + 1);
            } else if (objNum == 0x36) {
                result = 1;
            } else if (objNum == 0x37) {
                result = (((settings >> 4) & 0b1111) + 2);
            } else if (objNum == 0x38) {
                result = 1;
            } else if (objNum == 0x39) {
                result = (((settings >> 4) & 0b1111) + 1);
            } else if (objNum == 0x3A) {
                result = (((settings >> 4) & 0b1111) + 1);
            } else if (objNum == 0x3B) {
                result = (((settings) & 0b1111) + 1) * 2;
            } else if (objNum == 0x3C) {
                result = 1;
            } else if (objNum == 0x3D) {
                result = (((settings >> 4) & 0b1111) + 1);
            } else if (objNum == 0x3E) {
                result = 1;
            } else if (objNum == 0x3F) {
                result = (((settings >> 4) & 0b1111) + 1);
            }
        } else if (tileset == 3) {
            if (objNum == 0x34 || objNum == 0x35) {
                result = (((settings >> 4) & 0b1111) + 1);
            } else if (objNum == 0x36) {
                result = (((settings >> 4) & 0b1111) + 1);
            } else if (objNum == 0x37) {
                result = 1;
            } else if (objNum == 0x38) {
                result = (((settings >> 4) & 0b1111) + 1);
            } else if (objNum == 0x39) {
                result = ((settings >>> 4) & 0b1111) + 2;
            } else if (objNum == 0x3A || objNum == 0x3B) {
                result = (((settings >> 4) & 0b1111) + 1);
            } else if (objNum == 0x3C) {
                result = (((settings) & 0b1111) + 1) * 2 + 1;
            } else if (objNum == 0x3D) {
                result = (((settings >> 4) & 0b1111) + 1);
            } else if (objNum == 0x3E) {
                result = (((settings >> 4) & 0b1111) + 1);
            } else if (objNum == 0x3F) {
                result = (((settings >> 4) & 0b1111) + 1);
            }
        } else if (tileset == 4) {
            if (objNum == 0x2E) {
                result = 1;
            } else if (objNum >= 0x2f && objNum <= 0x32) {
                result = (((settings >> 4) & 0b1111) + 1);
            } else if (objNum == 0x33) {
                result = 1;
            } else if (objNum == 0x34) {
                result = (((settings >> 4) & 0b1111) + 1);
            } else if (objNum >= 0x35 && objNum <= 0x36) {
                result = (((settings >> 4) & 0b1111) + 1);
            } else if (objNum == 0x37 || objNum == 0x38) {
                result = 1;
            } else if (objNum == 0x39 || objNum == 0x3A) {
                result = (((settings >> 4) & 0b1111) + 1);
            } else if (objNum == 0x3b) {
                result = 1;
            } else if (objNum >= 0x3c && objNum <= 0x3f) {
                result = (((settings >> 4) & 0b1111) + 1);
            }
        }
        
    }
    return result;    
}

function setPoint(top: number, left: number, r: number, g: number, b: number, ctx: CanvasRenderingContext2D, alpha: number = 1.0): void {
    ctx!.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
    ctx!.fillRect(left, top, 1, 1);    
}

function intdiv(a: number, b: number): number {
    return Math.floor(a/b);
}

function stripHeader(romData: any) {
    let result = Array.prototype.slice.call(romData);
    result.splice(0, 0x200);
    return result;
}

function compress_rle1(data: number[]): number[] {
    let i, j;
    let output: any = [];
    let buffer = [];
    let byteCount = 1;
    let isDirect = false;
    let directLength = 0;
    let debugOutput = "";

    for (i = 0; i < data.length; i++) {
        byteCount = 1;

        // rle
        for (j = i; j < data.length - 1; j++) {
            if (data[j] !== data[j + 1] ) {
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
                for (j=0; j<buffer.length; j++) {
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
        } else {
            if (isDirect) {
                if (directLength > 0b01111111) {
                    isDirect = false;
                    log("(Direct-Copy Length: " + (0b01111111 + 1) + ")");
                    output.push(0b01111111); 
                    output = output.concat(buffer);

                    debugOutput = "";
                    for (j=0; j<buffer.length; j++) {
                        debugOutput += hex(buffer[j]) + " ";
                    }
                    log(debugOutput);
                    
                    directLength = 1;
                    buffer = [];
                    buffer.push(data[i]);
                    isDirect = true;             
                    
                    continue;                     
                } else {
                    directLength++;
                    buffer.push(data[i]);
                }

            } else {
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
        for (j=0; j<buffer.length; j++) {
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

function arrayCompare(a: any, b: any) {
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

function log(msg: any) {
    console.log(msg);
}


function snes2pc(snes: number, type: string = "Auto", header: boolean = true): number {
    let result: number;
    let head: number;

    if (header) {
        head = 0x200;
    } else {
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
            result = (snes & 0x3FFFFF) + head + ((snes > 0x800000 ? 0x400000 : 0));
            break;
        case "ExLoROM":
            result = head + ((snes & 0x7FFF) | ((snes >>> 1) & 0x3F8000)) + (snes < 0x800000? 0x400000 : 0);
            break;       
        default:
            throw new TypeError();
    }
    return result;
}

function safeParseInt(str: any) {
    // must return 32 bit integer
    let result = parseInt(str);
    if (!isFinite(result)) 
        throw new TypeError();
    result = result | 0;
    return result;
}

function decompress_rle1(data: Uint8Array): number[] {
    let i, j;
    let length;
    let output = new Array();
    let outputBuffer = "";
    for (i = 0; i < data.length; i++) {
        if (i+1 < data.length && data[i] === 0xFF && data[i+1] === 0xFF) {
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
                for (j=0; j<length; j++) {
                    output.push(data[i+1+j]);
                    outputBuffer += hex(data[i+1+j]) + " ";
                }
                //log(outputBuffer);
                i += length;
                break;
            case 1:
                // rle
                length = (data[i] & 0b1111111) + 1;
                //log("(Byte-Copy Length: " + length + ")");
                outputBuffer = "";
                for (j=0; j<length; j++) {
                    output.push(data[i+1]);
                    outputBuffer += hex(data[i+1]) + " ";
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

function decompress_lz2(data: Uint8Array): number[] {
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
                    } else {
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
                address = (data[pointer+1] << 8) | (data[pointer+2]);
                for (i = 0; i < len; i++) {
                    output.push(output[address + i]);
                    debugOutput += hex(output[address + i]) +  " ";
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
                        len = (((data[pointer] & 0b11) << 8) | data[pointer+1]) + 1;
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
                        len = (((data[pointer] & 0b11) << 8) | data[pointer+1]) + 1;
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
                        len = (((data[pointer] & 0b11) << 8) | data[pointer+1]) + 1;
                        for (i = 0; i < len; i++) {
                            output.push(data[pointer + 2 + i] );  
                            debugOutput += hex(data[pointer + 2 + i]) + " ";
                        }
                        //log("(Direct-Copy-Long Length: " + len + ")");
                        //log(debugOutput);                       
                        pointer += len + 2;
                        break;
                    case 0b100:
                        // repeat
                        debugOutput = "";
                        len = (((data[pointer] & 0b11) << 8) | data[pointer+1]) + 1;
                        address = (data[pointer+2] << 8) | (data[pointer+3]);
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
                        len = (((data[pointer] & 0b11) << 8) | data[pointer+1]) + 1;
                        for (i = 0; i < len; i++) {
                            if (len % 2 === 0) {
                                output.push(data[pointer + 2]);
                                debugOutput += hex(data[pointer + 2]) + " ";
                            } else {
                                output.push(data[pointer + 3]);   
                                debugOutput += hex(data[pointer + 3]) + " ";
                            }
                        }
                        //log("(Word-Fill-Long Length: " + len + ")");
                        //log(debugOutput);      
                        pointer += 4;
                        break;                        
                    default:
                        throw new Error('unknown long command 0b' + (data[pointer] >>> 5).toString(2))
                }
                break;
            default:
                throw new Error('unknown command 0b' + (data[pointer] >>> 5).toString(2));
        }
    }
    return output;
}

function hex(val: number, length = 2): string {
    let result: string;
    let j: number;
    result = val.toString(16).toUpperCase();
    j = length - result.length;
    for (let i = 0; i < j; i++) {
        result = '0' + result;
    }
    return result;
}

function detectRomType(rom: any, header = true) {
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
    } else {
        romData = rom;
    }

    if (romData.length < 0x10000) {
        return "Invalid";
    }
    
    pos = 0;
    posi = 0x7FDC;

    temp = romData[posi + pos];
    temp <<= 8
    temp1 = (temp) | (romData[posi + (pos+1)]);

    pos += 2;

    temp = romData[posi + pos];
    temp <<= 8
    temp2 = (temp) | (romData[posi + (pos+1)]);

    pos += 2;

    if ((temp1 ^ temp2) === 0xffff) {
        posi = 0x7FD5;
        ptr = romData[posi];
    } else {
        posi = 0xffdc;

        pos = 0;

        temp = romData[posi + pos];
        temp <<= 8;
        temp1 = (temp) | (romData[posi + (pos+1)]);
        
        pos += 2;

        temp = romData[posi + pos];
        temp <<= 8;
        temp2 = (temp) | (romData[posi + (pos+1)]);

        pos += 2;

        if ((temp1 ^ temp2) != 0xFFFF) {
            return "Invalid";
        }

        posi = 0xFFD5;
        ptr = romData[posi];
    
    }

    if ((ptr & 0xf) == 5) {
        return "ExHiROM";
    } else if ((ptr & 0xf) == 3) {
        return "HiROM";
    } else if ((ptr & 1) == 1) {
        if (romData.length <= 0x400000) {
            return "HiROM";
        } else {
            return "ExHiROM";
        }
    } else if (romData.length <= 0x400000) {
        if ((ptr >> 4) >= 3) {
            return "LoROM2"
        } else {
            return "LoROM1";
        }
    } else {
        return "ExLoROM";
    }
    
}

function expand(data: Uint8Array, size: number, extended: boolean, format: string, mirror: boolean, header: boolean = true): number[] | undefined {
    let romData;

    // strip header
    if (header) {
        romData = new Array(data.length - 0x200);
        for (let i = 0; i < romData.length; i++) {
            romData[i] = data[i + 0x200];
        }
    } else {
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
            } else {
                newByte = newByte | 0x1;
            }
            break;
        default:
            newByte = newByte | currentMapType;
            break;
    }

    resultData[addr] = newByte;

    // adjust rom size header
    switch(type) {
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
    } else if (resultData.length > 0x200000) {
        resultData[addr] = 0xC;
    } else if (resultData.length > 0x100000) {
        resultData[addr] = 0xB;
    } else if (resultData.length > 0x80000) {
        resultData[addr] = 0xA;
    } else if (resultData.length > 0x40000) {
        resultData[addr] = 0x9;
    } else if (resultData.length > 0x20000) {
        resultData[addr] = 0x8;
    } else if (resultData.length > 0x10000) {
        resultData[addr] = 0x7;
    } else {
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
                        resultData = resultData.copyWithin(0x400000, 0x0, 0x400000)
                        for (let i = 0x8000; i <= 0x400000 - 1; i++) {
                            resultData[i] = 0;
                        }          
                    } else {
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
        } else {
            // mirror
            if (type == "HiROM" || type == "ExHiROM") {
                let pc = 0x408000;
                while (pc < resultData.length) {
                    let firstHalfLocation = pc - 0x400000;
                    resultData = resultData.copyWithin(pc, firstHalfLocation, firstHalfLocation + 0x8000);
                    pc += 0x10000
                }
            } else if (type == "LoROM1" || type == "LoROM2" || type == "ExLoROM") {
                resultData = resultData.copyWithin(0x400000, 0x0, 0x400000);
            } else {
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

function pc2snes4lorom1(pc: any, header = true) {
    if (header && pc < 0x200) {
        throw new TypeError();
    }
    let snes;
    if (header) pc -= 0x200;
    if (pc >= 0x400000) {
        throw new TypeError();
    } else {
        snes = pc << 1;
        snes = snes & 0x7f0000;
        snes = snes | ((pc | 0x8000) & 0xffff);
        if (pc > 0x380000) {
            snes += 0x800000;
        }
    }
    return snes;
}

function pc2snes4lorom2(pc: number, header = true ) {
    if (header && pc < 0x200) {
        throw new TypeError();
    }
    let snes;
    if (header) pc -= 0x200;
    if (pc >= 0x400000) {
        throw new TypeError();
    } else {
        snes = pc << 1;
        snes = snes & 0x7f0000;
        snes = snes | ((pc | 0x8000) & 0xffff);
        snes += 0x800000;;
    }
    return snes;
}

function pc2snes4hirom(pc: number, header = true ) {
    if (header && pc < 0x200) {
        throw new TypeError("pc address is too small");
    }
    let snes;
    if (header) pc -= 0x200;
    if (pc >= 0x400000) {
        throw new TypeError("pc address is too big");
    } else {
        snes = pc | 0xC00000;
    }
    return snes;
}

function pc2snes4exlorom(pc: number, header = true) {
    if (header && pc < 0x200) {
        
        throw new TypeError();
    }
    let snes;
    if (header) pc -= 0x200;
    if (pc >= 0x7F0000) {
        throw new TypeError();
    } else {
        snes = pc << 1;
        snes = snes & 0x7F0000;
        snes = snes | ((pc | 0x8000) & 0xFFFF)
        if (snes < 0x400000) {
            snes += 0x800000;
        }
    }
    return snes;
}

function pc2snes4exhirom(pc: number, header = true) {
    if (header && pc < 0x200) {
        throw new TypeError();
    }
    let snes;
    if (header) pc -= 0x200;

    if (pc >= 0x7E0000) {
        throw new TypeError();
    } else {
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

function pc2snes4ram(pc: number, header = true) {
    if (header && pc < 0x200) {
        throw new TypeError();
    }

    let snes;

    if (pc < 0xc13 || pc >= 0x20c13) {
        throw new TypeError();
    } else {
        snes = pc - 0xC13 + 0x7E0000;
    }
    return snes;
}

function pc2snes4vram(pc: number, header = true) {
    if (header && pc < 0x200) {
        throw new TypeError();
    }

    let snes;

    if (pc >= 0x20c13 && pc < 0x30c13) {
        throw new TypeError();
    } else {
        snes = pc - 0x20C13;
        snes = snes >> 1;
    }
    return snes;
}


function pc2snes(pc: any, type: string = "Auto", header = true) {
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

function unload() {
    location.reload();
}

function getX(obj: Obj, tset: number = -1): number {
    const objNum = obj.objNum;
    const settings = obj.settings;
    
    if (tset === -1) {
        tset = tileset;
    }
    
    switch (objNum) {
        case 0:
            return obj.x;
            break;
        case 0x12:
            {
                const type = ((settings >>> 0) & 0b1111);
                const height = getHeight(objNum, settings, tileset);

                if (type === 0) {  
                    return (obj.x + 2) - ((height - 1) * 2);
                } else if (type === 1) {
                    return obj.x - (height - 2);
                } else if (type === 2) {
                    return (obj.x + 4) - (4*(height-1));
                } else {
                    return obj.x;
                }
            }
            break;
        default:
            return obj.x;
            break;
    }
    return obj.x;
}

function getY(obj: Obj, tset: number = -1): number {
    return obj.y;
}

function getRealY(y: number, obj: Obj, tset: number = -1): number {
    return y;
}

function getRealX(x: number, obj: Obj, tset: number = -1): number {
    const objNum = obj.objNum;
    const settings = obj.settings;
    
    if (tset === -1) {
        tset = tileset;
    }

    switch (objNum) {
        case 0:
            return obj.x;
            break;
        case 0x12:
            {
                const type = ((settings >>> 0) & 0b1111);
                const height = getHeight(objNum, settings, tileset);

                if (type === 0) {  
                    return x - 2 + ((height - 1) * 2);
                } else if (type === 1) {
                    return x + (height - 2);
                } else if (type === 2) {
                    return x - 4 + (4*(height-1));
                } else {
                    return obj.x;
                }
            }
            break;
        default:
            return obj.x;
            break;
    }

    return obj.x;
}