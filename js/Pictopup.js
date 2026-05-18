var pictopup = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // src/Pictopup/Pictopup.ts
  var Pictopup_exports = {};
  __export(Pictopup_exports, {
    Palette: () => Palette,
    Pictopup: () => Pictopup,
    PixelBuffer: () => PixelBuffer,
    StampTool: () => StampTool
  });

  // src/Pictopup/Palette.ts
  var Palette = class {
    /**
     * Builds a new Palette object and sets the default colors
     */
    constructor() {
      /** Array of palette colors, stored as RGBA */
      __publicField(this, "colors");
      this.colors = new Uint32Array([
        4294967295,
        // #FFFFFFFF
        4278190080,
        // #000000FF
        4283782485,
        // #555555FF
        4289374890,
        // #AAAAAAFF
        4278190335,
        // #FF0000FF
        4278223103,
        // #FF8000FF
        4278255615,
        // #FFFF00FF
        4278255488,
        // #80FF00FF
        4278255360,
        // #00FF00FF
        4286643968,
        // #00FF80FF
        4294967040,
        // #00FFFFFF
        4294934528,
        // #0080FFFF
        4294901760,
        // #0000FFFF
        4294901888,
        // #8000FFFF
        4294902015,
        // #FF00FFFF
        4286578943
        // #FF0080FF
      ]);
    }
  };

  // src/Pictopup/PixelBuffer.ts
  var PixelBuffer = class _PixelBuffer {
    /**
     * Creates a new buffer of a specified size
     * @param sx Size X
     * @param sy Size Y
     */
    constructor(sx, sy) {
      /** Array of palette indices */
      __publicField(this, "arr");
      /** Width of buffer */
      __publicField(this, "width");
      /** Height of buffer */
      __publicField(this, "height");
      this.arr = new Int8Array(sx * sy);
      this.width = sx;
      this.height = sy;
    }
    /**
     * Creates a duplicate PixelBuffer object based on an existing one
     * @returns Duplicated pixel buffer
     */
    clone() {
      var retBuffer = new _PixelBuffer(this.width, this.height);
      retBuffer.arr = this.arr.slice();
      return retBuffer;
    }
    /**
     * Copies pixel data from another buffer into this one
     * Boundaries will automatically be applied to this buffer
     * Ensure that source indices do not overrun or issues will arise
     * @param buffer Buffer to copy information from
     * @param dx Destination X
     * @param dy Destination Y
     * @param sx Source X
     * @param sy Source Y
     * @param sw Source width
     * @param sh Source height
     * @param mask Mask pixel value, the mask will not be copied over if set
     */
    blit(buffer, dx, dy, sx, sy, sw, sh, mask = -1 /* PALETTE_MASK */) {
      var maxDx = Math.min(this.width, dx + sw);
      var maxDy = Math.min(this.height, dy + sh);
      sw = Math.min(sw, buffer.width - sx);
      sh = Math.min(sh, buffer.height - sy);
      for (var iX = 0; iX < sw; iX++) {
        var iDx = dx + iX;
        if (iDx < 0 || iDx >= maxDx) continue;
        for (var iY = 0; iY < sh; iY++) {
          var iDy = dy + iY;
          if (iDy < 0 || iDy > maxDy) continue;
          var pixel = buffer.arr[sx + iX + (sy + iY) * buffer.width];
          if (pixel != mask) {
            this.arr[iDx + iDy * this.width] = pixel;
          }
        }
      }
    }
    /**
     * Takes a portion of the pixel buffer and creates a new buffer with its contents
     * @param px Position X
     * @param py Position Y
     * @param width Width of slice
     * @param height Height of slice
     * @returns New pixel buffer made of the portion sliced
     */
    slice(px, py, width, height) {
      if (px + width > this.width) width = this.width - px;
      if (py + height > this.height) height = this.height - py;
      var buffer = new _PixelBuffer(width, height);
      for (var iX = px; iX < px + width; iX++) {
        for (var iY = py; iY < py + height; iY++) {
          buffer.arr[iX - px + (iY - py) * width] = this.arr[iX + iY * this.width];
        }
      }
      return buffer;
    }
    /**
     * Resizes the buffer, copying the information currently stored within into
     * the coordinates specified at (px, py).
     * 
     * Any empty coordinates are written as PALETTE_MASK
     * @param dx X coordinate to blit contents to in resized buffer
     * @param dy Y coordinate to blit contents to in resized buffer
     * @param width Width of new buffer
     * @param height Height of new buffer
     */
    scale(dx, dy, width, height) {
      var newArray = new Int8Array(width * height);
      newArray.fill(-1 /* PALETTE_MASK */);
      var sX = Math.min(width - dx, this.width);
      var sY = Math.min(height - dy, this.height);
      for (var iX = 0; iX < sX; iX++) {
        for (var iY = 0; iY < sY; iY++) {
          newArray[dx + iX + (dy + iY) * width] = this.arr[iX + iY * this.width];
        }
      }
      this.arr = newArray;
      this.width = width;
      this.height = height;
    }
    /**
     * Generates a drawable bitmap from the data contained in this object
     * @param palette Palette to use to render bitmap
     * @returns New bitmap created from PaletteBuffer
     */
    rasterize(palette) {
      return __async(this, null, function* () {
        var imageData = new ImageData(this.width, this.height);
        var datBuffer = new Uint32Array(imageData.data.buffer);
        for (var i = 0; i < datBuffer.length; i++) {
          var pixel = this.arr[i];
          if (pixel > 15 /* PALETTE_LAST */) {
            datBuffer[i] = palette.colors[0 /* PALETTE_0 */];
          } else {
            datBuffer[i] = palette.colors[pixel];
          }
        }
        return createImageBitmap(imageData);
      });
    }
  };

  // src/Pictopup/Geometry.ts
  var Vector2 = class _Vector2 {
    constructor() {
      __publicField(this, "x");
      __publicField(this, "y");
      this.x = 0;
      this.y = 0;
    }
    static create(x, y) {
      var vec = new _Vector2();
      vec.x = x;
      vec.y = y;
      return vec;
    }
    add(v) {
      this.x += v.x;
      this.y += v.y;
    }
    sub(v) {
      this.x += v.x;
      this.y += v.y;
    }
    mul(v) {
      this.x *= v.x;
      this.y *= v.y;
    }
    div(v) {
      this.x /= v.x;
      this.y /= v.y;
    }
  };
  var Rect = class _Rect {
    constructor() {
      __publicField(this, "topLeft");
      __publicField(this, "btmRight");
      this.topLeft = new Vector2();
      this.btmRight = new Vector2();
    }
    static create(topLeft, btmRight) {
      var rect = new _Rect();
      rect.topLeft = topLeft;
      rect.btmRight = btmRight;
      return rect;
    }
    width() {
      return this.btmRight.x - this.topLeft.x;
    }
    height() {
      return this.btmRight.y - this.topLeft.y;
    }
  };

  // src/Pictopup/Tools/StampTool.ts
  var BUFFER_PADDING_SIZE = 50;
  var StampTool = class {
    constructor(picto) {
      __publicField(this, "lockInput");
      __publicField(this, "picto");
      __publicField(this, "currentColor");
      __publicField(this, "currentScale");
      __publicField(this, "lastMousePos");
      __publicField(this, "stamp");
      __publicField(this, "stampCopy");
      /** Work buffer, copy of picto's size */
      __publicField(this, "workBuffer");
      /** Top left of work buffer in canvas space */
      __publicField(this, "workBufferCoordinates");
      /** True rect of work buffer contents */
      __publicField(this, "workBufferRect");
      this.lockInput = false;
      this.picto = picto;
      this.currentColor = 1 /* PALETTE_1 */;
      this.currentScale = 1;
    }
    /** 
     * Creates a new work buffer to draw changes to
     */
    createNewWorkBuffer() {
      this.workBuffer = new PixelBuffer(BUFFER_PADDING_SIZE, BUFFER_PADDING_SIZE);
      this.workBuffer.arr.fill(-1 /* PALETTE_MASK */);
      delete this.workBufferCoordinates;
      delete this.workBufferRect;
    }
    /**
     * Resizes the work buffer to have enough room to blit the requested rect
     * @param rect New rect being blit in canvas-space coordinates
     */
    resizeWorkBuffer(rect) {
      var _a;
      if (this.workBuffer == void 0) return;
      if (this.workBufferCoordinates == void 0) {
        this.workBufferCoordinates = Vector2.create(rect.topLeft.x, rect.topLeft.y);
      }
      var leftScale = 0;
      var rightScale = 0;
      var upScale = 0;
      var dnScale = 0;
      if (rect.topLeft.x < this.workBufferCoordinates.x) {
        leftScale = Math.max(BUFFER_PADDING_SIZE, this.workBufferCoordinates.x - rect.topLeft.x);
        this.workBufferCoordinates.x -= leftScale;
      }
      if (rect.btmRight.x >= this.workBufferCoordinates.x + leftScale + this.workBuffer.width) {
        rightScale = Math.max(BUFFER_PADDING_SIZE, rect.btmRight.x - (this.workBufferCoordinates.x + leftScale + this.workBuffer.width));
      }
      if (rect.topLeft.y < this.workBufferCoordinates.y) {
        upScale = Math.max(BUFFER_PADDING_SIZE, this.workBufferCoordinates.y - rect.topLeft.y);
        this.workBufferCoordinates.y -= upScale;
      }
      if (rect.btmRight.y >= this.workBufferCoordinates.y + upScale + this.workBuffer.height) {
        dnScale = Math.max(BUFFER_PADDING_SIZE, rect.btmRight.y - (this.workBufferCoordinates.y + upScale + this.workBuffer.height));
      }
      if (leftScale + rightScale + upScale + dnScale != 0) {
        (_a = this.workBuffer) == null ? void 0 : _a.scale(leftScale, upScale, this.workBuffer.width + leftScale + rightScale, this.workBuffer.height + upScale + dnScale);
      }
      if (this.workBufferRect == void 0) {
        this.workBufferRect = Rect.create(
          Vector2.create(rect.topLeft.x - this.workBufferCoordinates.x, rect.topLeft.y - this.workBufferCoordinates.y),
          Vector2.create(rect.btmRight.x - this.workBufferCoordinates.x, rect.btmRight.y - this.workBufferCoordinates.y)
        );
      } else {
        this.workBufferRect.topLeft.x = Math.min(this.workBufferRect.topLeft.x, rect.topLeft.x - this.workBufferCoordinates.x);
        this.workBufferRect.topLeft.y = Math.min(this.workBufferRect.topLeft.y, rect.topLeft.y - this.workBufferCoordinates.y);
        this.workBufferRect.btmRight.x = Math.max(this.workBufferRect.btmRight.x + leftScale, rect.btmRight.x - this.workBufferCoordinates.x);
        this.workBufferRect.btmRight.y = Math.max(this.workBufferRect.btmRight.y + upScale, rect.btmRight.y - this.workBufferCoordinates.y);
      }
    }
    /**
     * Blits the current brush to the work buffer currently in use
     * @param px Center X coordinate
     * @param py Center Y coordinate
     */
    writeStampToWorkBuffer(px, py) {
      if (this.stampCopy == void 0) return;
      var rect = Rect.create(
        Vector2.create(px - Math.floor(this.currentScale / 2), py - Math.floor(this.currentScale / 2)),
        Vector2.create(px + Math.ceil(this.currentScale / 2), py + Math.ceil(this.currentScale / 2))
      );
      if (this.workBuffer == void 0) {
        this.createNewWorkBuffer();
      }
      this.resizeWorkBuffer(rect);
      var xCoord = rect.topLeft.x - this.workBufferCoordinates.x;
      var yCoord = rect.topLeft.y - this.workBufferCoordinates.y;
      this.workBuffer.blit(this.stampCopy, xCoord, yCoord, 0, 0, this.stampCopy.width, this.stampCopy.height);
    }
    /**
     * Writes the work buffer to the Pictopup instance
     */
    commitWorkBuffer() {
      if (this.workBuffer == void 0) return;
      if (this.workBufferCoordinates == void 0) return;
      this.picto.imageBuffer.blit(
        this.workBuffer,
        this.workBufferCoordinates.x,
        this.workBufferCoordinates.y,
        this.workBufferRect.topLeft.x,
        this.workBufferRect.topLeft.y,
        this.workBufferRect.width(),
        this.workBufferRect.height()
      );
      delete this.workBuffer;
      delete this.workBufferCoordinates;
      delete this.workBufferRect;
    }
    /**
     * Loads an image into the master stamp slot as well as its transformed copy
     * Any black pixels are interpreted as 
     * @param image Image to use as the stamp
     */
    loadStampFromImageData(image) {
      var pixelArray = new Uint32Array(image.data.buffer);
      this.stamp = new PixelBuffer(image.width, image.height);
      for (var i = 0; i < pixelArray.length; i++) {
        this.stamp.arr[i] = (pixelArray[i] & 4278190080) == 0 ? -1 /* PALETTE_MASK */ : this.currentColor;
      }
      this.stampCopy = this.stamp.clone();
      this.setScale(this.currentScale);
    }
    /**
     * Sets the pixel color of the stamp copy
     * @param color Palette color to use
     */
    setColor(color) {
      if (this.stampCopy != void 0) {
        for (var i = 0; i < this.stampCopy.arr.length; i++) {
          if (this.stampCopy.arr[i] != -1 /* PALETTE_MASK */) {
            this.stampCopy.arr[i] = color;
          }
        }
      }
      this.currentColor = color;
    }
    /**
     * Scales the desired output stamp to a new size
     * @param scale Height in pixels
     */
    setScale(scale) {
      if (this.stamp != void 0) {
        var newWidth = Math.floor(this.stamp.width / this.stamp.height * scale);
        var newHeight = scale;
        var rW = this.stamp.width / newWidth;
        var rH = this.stamp.height / newHeight;
        delete this.stampCopy;
        this.stampCopy = new PixelBuffer(newWidth, newHeight);
        this.stampCopy.arr.fill(-1 /* PALETTE_MASK */, 0, this.stampCopy.arr.length);
        for (var x = 0; x < newWidth; x++) {
          var sX = Math.floor(rW * x);
          for (var y = 0; y < newHeight; y++) {
            var sY = Math.floor(rH * y);
            if (this.stamp.arr[sX + sY * this.stamp.width] != -1 /* PALETTE_MASK */) {
              this.stampCopy.arr[x + y * newWidth] = this.currentColor;
            }
          }
        }
      }
      this.currentScale = scale;
    }
    processInputEvent(event) {
      if (event instanceof MouseEvent) {
        var mousePos = this.picto.ssToCanvasCoordinate(event.clientX, event.clientY);
        if (!this.lockInput) {
          if (event.type == "mousedown") {
            this.lockInput = true;
            this.createNewWorkBuffer();
            this.writeStampToWorkBuffer(mousePos.x, mousePos.y);
            this.lastMousePos = mousePos;
          }
        } else {
          if (event.type == "mousemove") {
            var delta = Vector2.create(mousePos.x - this.lastMousePos.x, mousePos.y - this.lastMousePos.y);
            var top = Math.max(Math.abs(delta.x), Math.abs(delta.y));
            if (top == 0) {
              this.writeStampToWorkBuffer(mousePos.x, mousePos.y);
            } else {
              var xRatio = delta.x / top;
              var yRatio = delta.y / top;
              for (var i = 0; i <= top; i++) {
                this.writeStampToWorkBuffer(mousePos.x - Math.floor(i * xRatio), mousePos.y - Math.floor(i * yRatio));
              }
            }
            this.lastMousePos = mousePos;
          } else if (event.type == "mouseup") {
            this.commitWorkBuffer();
            this.lockInput = false;
          }
        }
      }
    }
    render() {
      return __async(this, null, function* () {
        if (!this.lockInput) return;
        if (this.workBuffer != void 0 && this.workBufferCoordinates != void 0) {
          this.picto.workBuffer.blit(
            this.workBuffer,
            this.workBufferCoordinates.x,
            this.workBufferCoordinates.y,
            this.workBufferRect.topLeft.x,
            this.workBufferRect.topLeft.y,
            this.workBufferRect.width(),
            this.workBufferRect.height()
          );
        }
      });
    }
  };

  // src/Pictopup/Pictopup.ts
  var Pictopup = class {
    /**
     * Creates a new instance of the Pictopup image editor
     * @param div Div to parent the editor to
     */
    constructor(div) {
      /**
       * Tool being used by the user
       */
      __publicField(this, "currentTool");
      /**
       * Image buffer containing committed pixel data
       */
      __publicField(this, "imageBuffer");
      /**
       * Back buffer to be drawn to the canvas every frame
       */
      __publicField(this, "workBuffer");
      /**
       * Palette currently being used for output image
       */
      __publicField(this, "palette");
      __publicField(this, "canvas");
      __publicField(this, "ctx");
      this.palette = new Palette();
      this.imageBuffer = new PixelBuffer(800, 600);
      this.workBuffer = this.imageBuffer.clone();
      this.canvas = document.createElement("canvas");
      this.canvas.width = this.imageBuffer.width;
      this.canvas.height = this.imageBuffer.height;
      this.ctx = this.canvas.getContext("2d");
      div.appendChild(this.canvas);
      this.canvas.addEventListener("mousedown", this.processInputEvent.bind(this));
      this.canvas.addEventListener("mouseup", this.processInputEvent.bind(this));
      this.canvas.addEventListener("mousemove", this.processInputEvent.bind(this));
    }
    /**
     * Transforms screenspace coordinates into pixel coordinates on the canvas
     * @param mx Mouse position X in screen space
     * @param my Mouse position Y in screen space
     */
    ssToCanvasCoordinate(mx, my) {
      var bounds = this.canvas.getBoundingClientRect();
      return Vector2.create(
        Math.floor((mx - bounds.x) * this.imageBuffer.width / bounds.width),
        Math.floor((my - bounds.y) * this.imageBuffer.height / bounds.height)
      );
    }
    /**
     * Processes input events such as mouse movement, clicks, keystrokes, etc.
     * 
     */
    processInputEvent(event) {
      if (this.currentTool != void 0) {
        this.currentTool.processInputEvent(event);
        if (this.currentTool.lockInput) return;
      }
    }
    /**
     * Draws Pictopup and its tools to the canvas
     */
    render() {
      return __async(this, null, function* () {
        this.workBuffer.blit(this.imageBuffer, 0, 0, 0, 0, this.imageBuffer.width, this.imageBuffer.height);
        if (this.currentTool != void 0) {
          yield this.currentTool.render(this.ctx);
        }
        var buffer = yield this.workBuffer.rasterize(this.palette);
        this.ctx.drawImage(buffer, 0, 0);
      });
    }
  };
  return __toCommonJS(Pictopup_exports);
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjL1BpY3RvcHVwL1BpY3RvcHVwLnRzIiwgIi4uLy4uL3NyYy9QaWN0b3B1cC9QYWxldHRlLnRzIiwgIi4uLy4uL3NyYy9QaWN0b3B1cC9QaXhlbEJ1ZmZlci50cyIsICIuLi8uLi9zcmMvUGljdG9wdXAvR2VvbWV0cnkudHMiLCAiLi4vLi4vc3JjL1BpY3RvcHVwL1Rvb2xzL1N0YW1wVG9vbC50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiaW1wb3J0IHsgUGl4ZWxCdWZmZXIgfSBmcm9tIFwiLi9QaXhlbEJ1ZmZlci50c1wiO1xuaW1wb3J0IHsgUGFsZXR0ZSB9IGZyb20gXCIuL1BhbGV0dGVcIjtcbmltcG9ydCB7IEJhc2VUb29sIH0gZnJvbSBcIi4vVG9vbHMvQmFzZVRvb2wudHNcIjtcbmltcG9ydCB7IFN0YW1wVG9vbCB9IGZyb20gXCIuL1Rvb2xzL1N0YW1wVG9vbC50c1wiO1xuaW1wb3J0IHsgVmVjdG9yMiB9IGZyb20gXCIuL0dlb21ldHJ5LnRzXCI7XG5cbmV4cG9ydCB7IFBhbGV0dGUsIFBpeGVsQnVmZmVyLCBTdGFtcFRvb2wgfVxuXG4vKipcbiAqIEFuIGluc3RhbmNlIG9mIHRoZSBQaWN0b3B1cCBpbWFnZSBlZGl0b3JcbiAqL1xuZXhwb3J0IGNsYXNzIFBpY3RvcHVwIHtcbiAgICAvKipcbiAgICAgKiBUb29sIGJlaW5nIHVzZWQgYnkgdGhlIHVzZXJcbiAgICAgKi9cbiAgICBjdXJyZW50VG9vbD86IEJhc2VUb29sO1xuXG4gICAgLyoqXG4gICAgICogSW1hZ2UgYnVmZmVyIGNvbnRhaW5pbmcgY29tbWl0dGVkIHBpeGVsIGRhdGFcbiAgICAgKi9cbiAgICBpbWFnZUJ1ZmZlcjogUGl4ZWxCdWZmZXI7XG5cbiAgICAvKipcbiAgICAgKiBCYWNrIGJ1ZmZlciB0byBiZSBkcmF3biB0byB0aGUgY2FudmFzIGV2ZXJ5IGZyYW1lXG4gICAgICovXG4gICAgd29ya0J1ZmZlcjogUGl4ZWxCdWZmZXI7XG5cbiAgICAvKipcbiAgICAgKiBQYWxldHRlIGN1cnJlbnRseSBiZWluZyB1c2VkIGZvciBvdXRwdXQgaW1hZ2VcbiAgICAgKi9cbiAgICBwYWxldHRlOiBQYWxldHRlO1xuXG4gICAgcHJpdmF0ZSBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50O1xuICAgIHByaXZhdGUgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgbmV3IGluc3RhbmNlIG9mIHRoZSBQaWN0b3B1cCBpbWFnZSBlZGl0b3JcbiAgICAgKiBAcGFyYW0gZGl2IERpdiB0byBwYXJlbnQgdGhlIGVkaXRvciB0b1xuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGRpdjogSFRNTERpdkVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy5wYWxldHRlID0gbmV3IFBhbGV0dGUoKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuaW1hZ2VCdWZmZXIgPSBuZXcgUGl4ZWxCdWZmZXIoODAwLCA2MDApO1xuICAgICAgICB0aGlzLndvcmtCdWZmZXIgPSB0aGlzLmltYWdlQnVmZmVyLmNsb25lKCk7XG5cbiAgICAgICAgLy8gQnVpbGQgSFRNTFxuICAgICAgICB0aGlzLmNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG4gICAgICAgIHRoaXMuY2FudmFzLndpZHRoID0gdGhpcy5pbWFnZUJ1ZmZlci53aWR0aDtcbiAgICAgICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gdGhpcy5pbWFnZUJ1ZmZlci5oZWlnaHQ7XG5cbiAgICAgICAgdGhpcy5jdHggPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpIGFzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcblxuICAgICAgICBkaXYuYXBwZW5kQ2hpbGQodGhpcy5jYW52YXMpO1xuXG4gICAgICAgIC8vIFNldHVwIGV2ZW50c1xuICAgICAgICB0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIHRoaXMucHJvY2Vzc0lucHV0RXZlbnQuYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIHRoaXMucHJvY2Vzc0lucHV0RXZlbnQuYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgdGhpcy5wcm9jZXNzSW5wdXRFdmVudC5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUcmFuc2Zvcm1zIHNjcmVlbnNwYWNlIGNvb3JkaW5hdGVzIGludG8gcGl4ZWwgY29vcmRpbmF0ZXMgb24gdGhlIGNhbnZhc1xuICAgICAqIEBwYXJhbSBteCBNb3VzZSBwb3NpdGlvbiBYIGluIHNjcmVlbiBzcGFjZVxuICAgICAqIEBwYXJhbSBteSBNb3VzZSBwb3NpdGlvbiBZIGluIHNjcmVlbiBzcGFjZVxuICAgICAqL1xuICAgIHNzVG9DYW52YXNDb29yZGluYXRlKG14OiBudW1iZXIsIG15OiBudW1iZXIpOiBWZWN0b3IyIHtcbiAgICAgICAgdmFyIGJvdW5kczogRE9NUmVjdCA9IHRoaXMuY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgIHJldHVybiBWZWN0b3IyLmNyZWF0ZShcbiAgICAgICAgICAgIE1hdGguZmxvb3IoKG14ICAtIGJvdW5kcy54KSAqIHRoaXMuaW1hZ2VCdWZmZXIud2lkdGggLyBib3VuZHMud2lkdGgpLFxuICAgICAgICAgICAgTWF0aC5mbG9vcigobXkgIC0gYm91bmRzLnkpICogdGhpcy5pbWFnZUJ1ZmZlci5oZWlnaHQgLyBib3VuZHMuaGVpZ2h0KVxuICAgICAgICApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFByb2Nlc3NlcyBpbnB1dCBldmVudHMgc3VjaCBhcyBtb3VzZSBtb3ZlbWVudCwgY2xpY2tzLCBrZXlzdHJva2VzLCBldGMuXG4gICAgICogXG4gICAgICovXG4gICAgcHJvY2Vzc0lucHV0RXZlbnQoZXZlbnQ6IEV2ZW50KSB7XG4gICAgICAgIC8vIERvIHRvb2wgaW5wdXRcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFRvb2wgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRUb29sLnByb2Nlc3NJbnB1dEV2ZW50KGV2ZW50KTtcblxuICAgICAgICAgICAgLy8gRG8gbm90IGNvbnRpbnVlIHByb2Nlc3NpbmcgaWYgdGhlIGN1cnJlbnQgdG9vbCBpcyByZXF1aXJpbmcgYWxsIGZvY3VzXG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50VG9vbC5sb2NrSW5wdXQpIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFkZGl0aW9uYWwgcHJvY2Vzc2luZyBnb2VzIGhlcmUgb25jZSBpbXBsZW1lbnRlZFxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERyYXdzIFBpY3RvcHVwIGFuZCBpdHMgdG9vbHMgdG8gdGhlIGNhbnZhc1xuICAgICAqL1xuICAgIGFzeW5jIHJlbmRlcigpIHtcbiAgICAgICAgLy8gRHJhdyB1bmRlcmx5aW5nIGltYWdlIGxheWVyXG4gICAgICAgIHRoaXMud29ya0J1ZmZlci5ibGl0KHRoaXMuaW1hZ2VCdWZmZXIsIDAsIDAsIDAsIDAsIHRoaXMuaW1hZ2VCdWZmZXIud2lkdGgsIHRoaXMuaW1hZ2VCdWZmZXIuaGVpZ2h0KTtcbiAgICAgICAgXG4gICAgICAgIC8vIERyYXcgY3VycmVudCB0b29sIGlmIGJlaW5nIHVzZWRcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFRvb2wgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmN1cnJlbnRUb29sLnJlbmRlcih0aGlzLmN0eCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBEcmF3IGJhY2tidWZmZXIgdG8gY2FudmFzIGFzIGZpcnN0IGxheWVyXG4gICAgICAgIHZhciBidWZmZXI6IEltYWdlQml0bWFwID0gYXdhaXQgdGhpcy53b3JrQnVmZmVyLnJhc3Rlcml6ZSh0aGlzLnBhbGV0dGUpO1xuICAgICAgICB0aGlzLmN0eC5kcmF3SW1hZ2UoYnVmZmVyLCAwLCAwKTtcbiAgICB9XG59XG4iLCAiZXhwb3J0IGVudW0gUGFsZXR0ZUluZGV4IHtcbiAgICBQQUxFVFRFXzAgPSAweDAsXG4gICAgUEFMRVRURV9CQUNLR1JPVU5EID0gUEFMRVRURV8wLCAvLyBkZWZpbmUgYmFja2dyb3VuZCBsYXllclxuICAgIFBBTEVUVEVfMSA9IDB4MSxcbiAgICBQQUxFVFRFXzIgPSAweDIsXG4gICAgUEFMRVRURV8zID0gMHgzLFxuICAgIFBBTEVUVEVfNCA9IDB4NCxcbiAgICBQQUxFVFRFXzUgPSAweDUsXG4gICAgUEFMRVRURV82ID0gMHg2LFxuICAgIFBBTEVUVEVfNyA9IDB4NyxcbiAgICBQQUxFVFRFXzggPSAweDgsXG4gICAgUEFMRVRURV85ID0gMHg5LFxuICAgIFBBTEVUVEVfQSA9IDB4QSxcbiAgICBQQUxFVFRFX0IgPSAweEIsXG4gICAgUEFMRVRURV9DID0gMHhDLFxuICAgIFBBTEVUVEVfRCA9IDB4RCxcbiAgICBQQUxFVFRFX0UgPSAweEUsXG4gICAgUEFMRVRURV9GID0gMHhGLFxuICAgIFBBTEVUVEVfTEFTVCA9IFBBTEVUVEVfRixcbiAgICBQQUxFVFRFX01BU0sgPSAtMVxufVxuXG5leHBvcnQgY2xhc3MgUGFsZXR0ZSB7XG4gICAgLyoqIEFycmF5IG9mIHBhbGV0dGUgY29sb3JzLCBzdG9yZWQgYXMgUkdCQSAqL1xuICAgIGNvbG9yczogVWludDMyQXJyYXk7XG5cbiAgICAvKipcbiAgICAgKiBCdWlsZHMgYSBuZXcgUGFsZXR0ZSBvYmplY3QgYW5kIHNldHMgdGhlIGRlZmF1bHQgY29sb3JzXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuY29sb3JzID0gbmV3IFVpbnQzMkFycmF5KFtcbiAgICAgICAgICAgIDB4RkZGRkZGRkYsIC8vICNGRkZGRkZGRlxuICAgICAgICAgICAgMHhGRjAwMDAwMCwgLy8gIzAwMDAwMEZGXG4gICAgICAgICAgICAweEZGNTU1NTU1LCAvLyAjNTU1NTU1RkZcbiAgICAgICAgICAgIDB4RkZBQUFBQUEsIC8vICNBQUFBQUFGRlxuICAgICAgICAgICAgMHhGRjAwMDBGRiwgLy8gI0ZGMDAwMEZGXG4gICAgICAgICAgICAweEZGMDA4MEZGLCAvLyAjRkY4MDAwRkZcbiAgICAgICAgICAgIDB4RkYwMEZGRkYsIC8vICNGRkZGMDBGRlxuICAgICAgICAgICAgMHhGRjAwRkY4MCwgLy8gIzgwRkYwMEZGXG4gICAgICAgICAgICAweEZGMDBGRjAwLCAvLyAjMDBGRjAwRkZcbiAgICAgICAgICAgIDB4RkY4MEZGMDAsIC8vICMwMEZGODBGRlxuICAgICAgICAgICAgMHhGRkZGRkYwMCwgLy8gIzAwRkZGRkZGXG4gICAgICAgICAgICAweEZGRkY4MDAwLCAvLyAjMDA4MEZGRkZcbiAgICAgICAgICAgIDB4RkZGRjAwMDAsIC8vICMwMDAwRkZGRlxuICAgICAgICAgICAgMHhGRkZGMDA4MCwgLy8gIzgwMDBGRkZGXG4gICAgICAgICAgICAweEZGRkYwMEZGLCAvLyAjRkYwMEZGRkZcbiAgICAgICAgICAgIDB4RkY4MDAwRkYgLy8gI0ZGMDA4MEZGXG4gICAgICAgIF0pO1xuICAgIH1cbn0iLCAiaW1wb3J0IHsgUGFsZXR0ZSwgUGFsZXR0ZUluZGV4IH0gZnJvbSBcIi4vUGFsZXR0ZVwiO1xuXG4vKipcbiAqIEEgYnVmZmVyIGNvbnRhaW5pbmcgcGFsZXR0ZSBpbmRpY2VzIGFzIHBpeGVsIGluZm9ybWF0aW9uXG4gKi9cbmV4cG9ydCBjbGFzcyBQaXhlbEJ1ZmZlciB7XG4gICAgLyoqIEFycmF5IG9mIHBhbGV0dGUgaW5kaWNlcyAqL1xuICAgIGFycjogSW50OEFycmF5O1xuICAgIC8qKiBXaWR0aCBvZiBidWZmZXIgKi9cbiAgICB3aWR0aDogbnVtYmVyO1xuICAgIC8qKiBIZWlnaHQgb2YgYnVmZmVyICovXG4gICAgaGVpZ2h0OiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgbmV3IGJ1ZmZlciBvZiBhIHNwZWNpZmllZCBzaXplXG4gICAgICogQHBhcmFtIHN4IFNpemUgWFxuICAgICAqIEBwYXJhbSBzeSBTaXplIFlcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihzeDogbnVtYmVyLCBzeTogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuYXJyID0gbmV3IEludDhBcnJheShzeCAqIHN5KTtcbiAgICAgICAgdGhpcy53aWR0aCA9IHN4O1xuICAgICAgICB0aGlzLmhlaWdodCA9IHN5O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBkdXBsaWNhdGUgUGl4ZWxCdWZmZXIgb2JqZWN0IGJhc2VkIG9uIGFuIGV4aXN0aW5nIG9uZVxuICAgICAqIEByZXR1cm5zIER1cGxpY2F0ZWQgcGl4ZWwgYnVmZmVyXG4gICAgICovXG4gICAgY2xvbmUoKTogUGl4ZWxCdWZmZXIge1xuICAgICAgICB2YXIgcmV0QnVmZmVyOiBQaXhlbEJ1ZmZlciA9IG5ldyBQaXhlbEJ1ZmZlcih0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG4gICAgICAgIHJldEJ1ZmZlci5hcnIgPSB0aGlzLmFyci5zbGljZSgpO1xuICAgICAgICByZXR1cm4gcmV0QnVmZmVyO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENvcGllcyBwaXhlbCBkYXRhIGZyb20gYW5vdGhlciBidWZmZXIgaW50byB0aGlzIG9uZVxuICAgICAqIEJvdW5kYXJpZXMgd2lsbCBhdXRvbWF0aWNhbGx5IGJlIGFwcGxpZWQgdG8gdGhpcyBidWZmZXJcbiAgICAgKiBFbnN1cmUgdGhhdCBzb3VyY2UgaW5kaWNlcyBkbyBub3Qgb3ZlcnJ1biBvciBpc3N1ZXMgd2lsbCBhcmlzZVxuICAgICAqIEBwYXJhbSBidWZmZXIgQnVmZmVyIHRvIGNvcHkgaW5mb3JtYXRpb24gZnJvbVxuICAgICAqIEBwYXJhbSBkeCBEZXN0aW5hdGlvbiBYXG4gICAgICogQHBhcmFtIGR5IERlc3RpbmF0aW9uIFlcbiAgICAgKiBAcGFyYW0gc3ggU291cmNlIFhcbiAgICAgKiBAcGFyYW0gc3kgU291cmNlIFlcbiAgICAgKiBAcGFyYW0gc3cgU291cmNlIHdpZHRoXG4gICAgICogQHBhcmFtIHNoIFNvdXJjZSBoZWlnaHRcbiAgICAgKiBAcGFyYW0gbWFzayBNYXNrIHBpeGVsIHZhbHVlLCB0aGUgbWFzayB3aWxsIG5vdCBiZSBjb3BpZWQgb3ZlciBpZiBzZXRcbiAgICAgKi9cbiAgICBibGl0KGJ1ZmZlcjogUGl4ZWxCdWZmZXIsIGR4OiBudW1iZXIsIGR5OiBudW1iZXIsIHN4OiBudW1iZXIsIHN5OiBudW1iZXIsIHN3OiBudW1iZXIsIHNoOiBudW1iZXIsIG1hc2s6IG51bWJlciA9IFBhbGV0dGVJbmRleC5QQUxFVFRFX01BU0spOiB2b2lkIHtcbiAgICAgICAgdmFyIG1heER4OiBudW1iZXIgPSBNYXRoLm1pbih0aGlzLndpZHRoLCBkeCArIHN3KTtcbiAgICAgICAgdmFyIG1heER5OiBudW1iZXIgPSBNYXRoLm1pbih0aGlzLmhlaWdodCwgZHkgKyBzaCk7XG5cbiAgICAgICAgc3cgPSBNYXRoLm1pbihzdywgYnVmZmVyLndpZHRoIC0gc3gpO1xuICAgICAgICBzaCA9IE1hdGgubWluKHNoLCBidWZmZXIuaGVpZ2h0IC0gc3kpO1xuXG4gICAgICAgIGZvciAodmFyIGlYID0gMDsgaVggPCBzdzsgaVgrKykge1xuICAgICAgICAgICAgdmFyIGlEeCA9IGR4ICsgaVg7XG4gICAgICAgICAgICBpZiAoaUR4IDwgMCB8fCBpRHggPj0gbWF4RHgpIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpWSA9IDA7IGlZIDwgc2g7IGlZKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgaUR5ID0gZHkgKyBpWTtcbiAgICAgICAgICAgICAgICBpZiAoaUR5IDwgMCB8fCBpRHkgPiBtYXhEeSkgY29udGludWU7XG5cbiAgICAgICAgICAgICAgICB2YXIgcGl4ZWwgPSBidWZmZXIuYXJyW3N4ICsgaVggKyAoc3kgKyBpWSkgKiBidWZmZXIud2lkdGhdO1xuXG4gICAgICAgICAgICAgICAgaWYgKHBpeGVsICE9IG1hc2spIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcnJbaUR4ICsgaUR5ICogdGhpcy53aWR0aF0gPSBwaXhlbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUYWtlcyBhIHBvcnRpb24gb2YgdGhlIHBpeGVsIGJ1ZmZlciBhbmQgY3JlYXRlcyBhIG5ldyBidWZmZXIgd2l0aCBpdHMgY29udGVudHNcbiAgICAgKiBAcGFyYW0gcHggUG9zaXRpb24gWFxuICAgICAqIEBwYXJhbSBweSBQb3NpdGlvbiBZXG4gICAgICogQHBhcmFtIHdpZHRoIFdpZHRoIG9mIHNsaWNlXG4gICAgICogQHBhcmFtIGhlaWdodCBIZWlnaHQgb2Ygc2xpY2VcbiAgICAgKiBAcmV0dXJucyBOZXcgcGl4ZWwgYnVmZmVyIG1hZGUgb2YgdGhlIHBvcnRpb24gc2xpY2VkXG4gICAgICovXG4gICAgc2xpY2UocHg6IG51bWJlciwgcHk6IG51bWJlciwgd2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpOiBQaXhlbEJ1ZmZlciB7XG4gICAgICAgIGlmIChweCArIHdpZHRoID4gdGhpcy53aWR0aCkgd2lkdGggPSB0aGlzLndpZHRoIC0gcHg7XG4gICAgICAgIGlmIChweSArIGhlaWdodCA+IHRoaXMuaGVpZ2h0KSBoZWlnaHQgPSB0aGlzLmhlaWdodCAtIHB5O1xuXG4gICAgICAgIHZhciBidWZmZXI6IFBpeGVsQnVmZmVyID0gbmV3IFBpeGVsQnVmZmVyKHdpZHRoLCBoZWlnaHQpO1xuXG4gICAgICAgIGZvciAodmFyIGlYID0gcHg7IGlYIDwgcHggKyB3aWR0aDsgaVgrKykge1xuICAgICAgICAgICAgZm9yICh2YXIgaVkgPSBweTsgaVkgPCBweSArIGhlaWdodDsgaVkrKykge1xuICAgICAgICAgICAgICAgIGJ1ZmZlci5hcnJbaVggLSBweCArIChpWSAtIHB5KSAqIHdpZHRoXSA9IHRoaXMuYXJyW2lYICsgaVkgKiB0aGlzLndpZHRoXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBidWZmZXI7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVzaXplcyB0aGUgYnVmZmVyLCBjb3B5aW5nIHRoZSBpbmZvcm1hdGlvbiBjdXJyZW50bHkgc3RvcmVkIHdpdGhpbiBpbnRvXG4gICAgICogdGhlIGNvb3JkaW5hdGVzIHNwZWNpZmllZCBhdCAocHgsIHB5KS5cbiAgICAgKiBcbiAgICAgKiBBbnkgZW1wdHkgY29vcmRpbmF0ZXMgYXJlIHdyaXR0ZW4gYXMgUEFMRVRURV9NQVNLXG4gICAgICogQHBhcmFtIGR4IFggY29vcmRpbmF0ZSB0byBibGl0IGNvbnRlbnRzIHRvIGluIHJlc2l6ZWQgYnVmZmVyXG4gICAgICogQHBhcmFtIGR5IFkgY29vcmRpbmF0ZSB0byBibGl0IGNvbnRlbnRzIHRvIGluIHJlc2l6ZWQgYnVmZmVyXG4gICAgICogQHBhcmFtIHdpZHRoIFdpZHRoIG9mIG5ldyBidWZmZXJcbiAgICAgKiBAcGFyYW0gaGVpZ2h0IEhlaWdodCBvZiBuZXcgYnVmZmVyXG4gICAgICovXG4gICAgc2NhbGUoZHg6IG51bWJlciwgZHk6IG51bWJlciwgd2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgdmFyIG5ld0FycmF5ID0gbmV3IEludDhBcnJheSh3aWR0aCAqIGhlaWdodCk7XG4gICAgICAgIG5ld0FycmF5LmZpbGwoUGFsZXR0ZUluZGV4LlBBTEVUVEVfTUFTSyk7XG5cbiAgICAgICAgLy8gQ2FsY3VsYXRlIGJvdW5kcyBmb3IgYnVmZmVyIGNvcHlcbiAgICAgICAgdmFyIHNYOiBudW1iZXIgPSBNYXRoLm1pbih3aWR0aCAtIGR4LCB0aGlzLndpZHRoKTtcbiAgICAgICAgdmFyIHNZOiBudW1iZXIgPSBNYXRoLm1pbihoZWlnaHQgLSBkeSwgdGhpcy5oZWlnaHQpO1xuXG4gICAgICAgIC8vIGNvcHkgcGl4ZWxzIGZyb20gcHgvcHkgdG8gdGhlIGJvdW5kcyBzZXRcbiAgICAgICAgZm9yICh2YXIgaVggPSAwOyBpWCA8IHNYOyBpWCsrKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpWSA9IDA7IGlZIDwgc1k7IGlZKyspIHtcbiAgICAgICAgICAgICAgICBuZXdBcnJheVtkeCArIGlYICsgKGR5ICsgaVkpICogd2lkdGhdID0gdGhpcy5hcnJbaVggKyBpWSAqIHRoaXMud2lkdGhdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5hcnIgPSBuZXdBcnJheTtcbiAgICAgICAgdGhpcy53aWR0aCA9IHdpZHRoO1xuICAgICAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZW5lcmF0ZXMgYSBkcmF3YWJsZSBiaXRtYXAgZnJvbSB0aGUgZGF0YSBjb250YWluZWQgaW4gdGhpcyBvYmplY3RcbiAgICAgKiBAcGFyYW0gcGFsZXR0ZSBQYWxldHRlIHRvIHVzZSB0byByZW5kZXIgYml0bWFwXG4gICAgICogQHJldHVybnMgTmV3IGJpdG1hcCBjcmVhdGVkIGZyb20gUGFsZXR0ZUJ1ZmZlclxuICAgICAqL1xuICAgIGFzeW5jIHJhc3Rlcml6ZShwYWxldHRlOiBQYWxldHRlKTogUHJvbWlzZTxJbWFnZUJpdG1hcD4ge1xuICAgICAgICAvLyBDcmVhdGUgaW1hZ2UgZGF0YSBvZiByaWdodCBzaXplXG4gICAgICAgIHZhciBpbWFnZURhdGE6IEltYWdlRGF0YSA9IG5ldyBJbWFnZURhdGEodGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuICAgICAgICB2YXIgZGF0QnVmZmVyID0gbmV3IFVpbnQzMkFycmF5KGltYWdlRGF0YS5kYXRhLmJ1ZmZlcik7XG5cbiAgICAgICAgLy8gUmVhZCBpbiBwYWxldHRlIGluZm9ybWF0aW9uIHVzaW5nIGluZGljZXMgaW4gdGhlIGJ1ZmZlclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdEJ1ZmZlci5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIHBpeGVsID0gdGhpcy5hcnJbaV07XG5cbiAgICAgICAgICAgIGlmIChwaXhlbCA+IFBhbGV0dGVJbmRleC5QQUxFVFRFX0xBU1QpIHtcbiAgICAgICAgICAgICAgICAvLyBkbyBub3QgYWxsb3cgZHJhd2luZyBpbnZhbGlkIHBpeGVsc1xuICAgICAgICAgICAgICAgIGRhdEJ1ZmZlcltpXSA9IHBhbGV0dGUuY29sb3JzW1BhbGV0dGVJbmRleC5QQUxFVFRFXzBdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkYXRCdWZmZXJbaV0gPSBwYWxldHRlLmNvbG9yc1twaXhlbF07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyByZXR1cm4gbmV3IGJ1ZmZlclxuICAgICAgICByZXR1cm4gY3JlYXRlSW1hZ2VCaXRtYXAoaW1hZ2VEYXRhKTtcbiAgICB9XG59IiwgImV4cG9ydCBjbGFzcyBWZWN0b3IyIHtcbiAgICB4OiBudW1iZXI7XG4gICAgeTogbnVtYmVyO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMueCA9IDA7XG4gICAgICAgIHRoaXMueSA9IDA7XG4gICAgfVxuXG4gICAgc3RhdGljIGNyZWF0ZSh4OiBudW1iZXIsIHk6IG51bWJlcik6IFZlY3RvcjIge1xuICAgICAgICB2YXIgdmVjID0gbmV3IFZlY3RvcjIoKTtcbiAgICAgICAgdmVjLnggPSB4O1xuICAgICAgICB2ZWMueSA9IHk7XG4gICAgICAgIHJldHVybiB2ZWM7XG4gICAgfVxuXG4gICAgYWRkKHY6IFZlY3RvcjIpIHtcbiAgICAgICAgdGhpcy54ICs9IHYueDtcbiAgICAgICAgdGhpcy55ICs9IHYueTtcbiAgICB9XG5cbiAgICBzdWIodjogVmVjdG9yMikge1xuICAgICAgICB0aGlzLnggKz0gdi54O1xuICAgICAgICB0aGlzLnkgKz0gdi55O1xuICAgIH1cblxuICAgIG11bCh2OiBWZWN0b3IyKSB7XG4gICAgICAgIHRoaXMueCAqPSB2Lng7XG4gICAgICAgIHRoaXMueSAqPSB2Lnk7XG4gICAgfVxuXG4gICAgZGl2KHY6IFZlY3RvcjIpIHtcbiAgICAgICAgdGhpcy54IC89IHYueDtcbiAgICAgICAgdGhpcy55IC89IHYueTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBSZWN0IHsgICAgXG4gICAgdG9wTGVmdDogVmVjdG9yMjtcbiAgICBidG1SaWdodDogVmVjdG9yMjtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnRvcExlZnQgPSBuZXcgVmVjdG9yMigpO1xuICAgICAgICB0aGlzLmJ0bVJpZ2h0ID0gbmV3IFZlY3RvcjIoKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgY3JlYXRlKHRvcExlZnQ6IFZlY3RvcjIsIGJ0bVJpZ2h0OiBWZWN0b3IyKTogUmVjdCB7XG4gICAgICAgIHZhciByZWN0ID0gbmV3IFJlY3QoKTtcblxuICAgICAgICByZWN0LnRvcExlZnQgPSB0b3BMZWZ0O1xuICAgICAgICByZWN0LmJ0bVJpZ2h0ID0gYnRtUmlnaHQ7XG5cbiAgICAgICAgcmV0dXJuIHJlY3Q7XG4gICAgfVxuXG4gICAgd2lkdGgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmJ0bVJpZ2h0LnggLSB0aGlzLnRvcExlZnQueDtcbiAgICB9XG5cbiAgICBoZWlnaHQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmJ0bVJpZ2h0LnkgLSB0aGlzLnRvcExlZnQueTtcbiAgICB9XG59IiwgImltcG9ydCB7IFBhbGV0dGVJbmRleCB9IGZyb20gXCIuLi9QYWxldHRlXCI7XG5pbXBvcnQgeyBQaWN0b3B1cCB9IGZyb20gXCIuLi9QaWN0b3B1cFwiO1xuaW1wb3J0IHsgUGl4ZWxCdWZmZXIgfSBmcm9tIFwiLi4vUGl4ZWxCdWZmZXJcIjtcbmltcG9ydCB7IFJlY3QsIFZlY3RvcjIgfSBmcm9tIFwiLi4vR2VvbWV0cnlcIjtcbmltcG9ydCB7IEJhc2VUb29sIH0gZnJvbSBcIi4vQmFzZVRvb2xcIjtcblxuLyoqIEhvdyBtYW55IHBpeGVscyBpbiBhbnkgZGlyZWN0aW9uIHRvIHJlc2l6ZSB0aGUgcGl4ZWwgYnVmZmVyIHdoZW4gZHJhd2luZyB0byBhbiB1bmRlZmluZWQgcmVnaW9uIG9mIGl0ICovXG5jb25zdCBCVUZGRVJfUEFERElOR19TSVpFID0gNTA7XG5cbmV4cG9ydCBjbGFzcyBTdGFtcFRvb2wgaW1wbGVtZW50cyBCYXNlVG9vbCB7XG4gICAgbG9ja0lucHV0OiBib29sZWFuO1xuICAgIHBpY3RvOiBQaWN0b3B1cDtcblxuICAgIGN1cnJlbnRDb2xvcjogUGFsZXR0ZUluZGV4O1xuICAgIGN1cnJlbnRTY2FsZTogbnVtYmVyO1xuICAgIGxhc3RNb3VzZVBvcz86IFZlY3RvcjI7XG5cbiAgICBwcml2YXRlIHN0YW1wPzogUGl4ZWxCdWZmZXI7XG4gICAgc3RhbXBDb3B5PzogUGl4ZWxCdWZmZXI7XG5cbiAgICAvKiogV29yayBidWZmZXIsIGNvcHkgb2YgcGljdG8ncyBzaXplICovXG4gICAgd29ya0J1ZmZlcj86IFBpeGVsQnVmZmVyO1xuICAgIC8qKiBUb3AgbGVmdCBvZiB3b3JrIGJ1ZmZlciBpbiBjYW52YXMgc3BhY2UgKi9cbiAgICB3b3JrQnVmZmVyQ29vcmRpbmF0ZXM/OiBWZWN0b3IyO1xuICAgIC8qKiBUcnVlIHJlY3Qgb2Ygd29yayBidWZmZXIgY29udGVudHMgKi9cbiAgICB3b3JrQnVmZmVyUmVjdD86IFJlY3Q7XG5cbiAgICBjb25zdHJ1Y3RvcihwaWN0bzogUGljdG9wdXApIHtcbiAgICAgICAgdGhpcy5sb2NrSW5wdXQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5waWN0byA9IHBpY3RvO1xuXG4gICAgICAgIHRoaXMuY3VycmVudENvbG9yID0gUGFsZXR0ZUluZGV4LlBBTEVUVEVfMTsgLy8gZmlyc3Qgbm9uLWJhY2tncm91bmQgY29sb3JcbiAgICAgICAgdGhpcy5jdXJyZW50U2NhbGUgPSAxO1xuICAgIH1cblxuICAgIC8qKiBcbiAgICAgKiBDcmVhdGVzIGEgbmV3IHdvcmsgYnVmZmVyIHRvIGRyYXcgY2hhbmdlcyB0b1xuICAgICAqL1xuICAgIHByaXZhdGUgY3JlYXRlTmV3V29ya0J1ZmZlcigpIHtcbiAgICAgICAgdGhpcy53b3JrQnVmZmVyID0gbmV3IFBpeGVsQnVmZmVyKEJVRkZFUl9QQURESU5HX1NJWkUsIEJVRkZFUl9QQURESU5HX1NJWkUpO1xuICAgICAgICB0aGlzLndvcmtCdWZmZXIuYXJyLmZpbGwoUGFsZXR0ZUluZGV4LlBBTEVUVEVfTUFTSyk7XG5cbiAgICAgICAgLy8gQ2xlYXIgZXhpc3Rpbmcgd29yayBjb29yZGluYXRlcyBcbiAgICAgICAgZGVsZXRlIHRoaXMud29ya0J1ZmZlckNvb3JkaW5hdGVzO1xuICAgICAgICBkZWxldGUgdGhpcy53b3JrQnVmZmVyUmVjdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXNpemVzIHRoZSB3b3JrIGJ1ZmZlciB0byBoYXZlIGVub3VnaCByb29tIHRvIGJsaXQgdGhlIHJlcXVlc3RlZCByZWN0XG4gICAgICogQHBhcmFtIHJlY3QgTmV3IHJlY3QgYmVpbmcgYmxpdCBpbiBjYW52YXMtc3BhY2UgY29vcmRpbmF0ZXNcbiAgICAgKi9cbiAgICBwcml2YXRlIHJlc2l6ZVdvcmtCdWZmZXIocmVjdDogUmVjdCkge1xuICAgICAgICBpZiAodGhpcy53b3JrQnVmZmVyID09IHVuZGVmaW5lZCkgcmV0dXJuO1xuXG4gICAgICAgIC8vIEF1dG8tYXNzaWduIHRvcCBsZWZ0IGNvb3JkaW5hdGUgaWYgcG9zc2libGVcbiAgICAgICAgaWYgKHRoaXMud29ya0J1ZmZlckNvb3JkaW5hdGVzID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy53b3JrQnVmZmVyQ29vcmRpbmF0ZXMgPSBWZWN0b3IyLmNyZWF0ZShyZWN0LnRvcExlZnQueCwgcmVjdC50b3BMZWZ0LnkpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGxlZnRTY2FsZSA9IDA7IC8vIGRvdWJsZXMgYXMgbmV3IFggb2Zmc2V0IG9mIHJlc2l6ZVxuICAgICAgICB2YXIgcmlnaHRTY2FsZSA9IDA7XG4gICAgICAgIHZhciB1cFNjYWxlID0gMDsgLy8gZG91YmxlcyBhcyBuZXcgWSBvZmZzZXQgb2YgcmVzaXplXG4gICAgICAgIHZhciBkblNjYWxlID0gMDtcblxuICAgICAgICAvLyBEZXRlcm1pbmUgbGVmdCBzY2FsZVxuICAgICAgICBpZiAocmVjdC50b3BMZWZ0LnggPCB0aGlzLndvcmtCdWZmZXJDb29yZGluYXRlcy54KSB7XG4gICAgICAgICAgICBsZWZ0U2NhbGUgPSBNYXRoLm1heChCVUZGRVJfUEFERElOR19TSVpFLCB0aGlzLndvcmtCdWZmZXJDb29yZGluYXRlcy54IC0gcmVjdC50b3BMZWZ0LngpO1xuICAgICAgICAgICAgdGhpcy53b3JrQnVmZmVyQ29vcmRpbmF0ZXMueCAtPSBsZWZ0U2NhbGU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlY3QuYnRtUmlnaHQueCA+PSB0aGlzLndvcmtCdWZmZXJDb29yZGluYXRlcy54ICsgbGVmdFNjYWxlICsgdGhpcy53b3JrQnVmZmVyLndpZHRoKSB7XG4gICAgICAgICAgICByaWdodFNjYWxlID0gTWF0aC5tYXgoQlVGRkVSX1BBRERJTkdfU0laRSwgcmVjdC5idG1SaWdodC54IC0gKHRoaXMud29ya0J1ZmZlckNvb3JkaW5hdGVzLnggKyBsZWZ0U2NhbGUgKyB0aGlzLndvcmtCdWZmZXIud2lkdGgpKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVjdC50b3BMZWZ0LnkgPCB0aGlzLndvcmtCdWZmZXJDb29yZGluYXRlcy55KSB7XG4gICAgICAgICAgICB1cFNjYWxlID0gTWF0aC5tYXgoQlVGRkVSX1BBRERJTkdfU0laRSwgdGhpcy53b3JrQnVmZmVyQ29vcmRpbmF0ZXMueSAtIHJlY3QudG9wTGVmdC55KTtcbiAgICAgICAgICAgIHRoaXMud29ya0J1ZmZlckNvb3JkaW5hdGVzLnkgLT0gdXBTY2FsZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVjdC5idG1SaWdodC55ID49IHRoaXMud29ya0J1ZmZlckNvb3JkaW5hdGVzLnkgKyB1cFNjYWxlICsgdGhpcy53b3JrQnVmZmVyLmhlaWdodCkge1xuICAgICAgICAgICAgZG5TY2FsZSA9IE1hdGgubWF4KEJVRkZFUl9QQURESU5HX1NJWkUsIHJlY3QuYnRtUmlnaHQueSAtICh0aGlzLndvcmtCdWZmZXJDb29yZGluYXRlcy55ICsgdXBTY2FsZSArIHRoaXMud29ya0J1ZmZlci5oZWlnaHQpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChsZWZ0U2NhbGUgKyByaWdodFNjYWxlICsgdXBTY2FsZSArIGRuU2NhbGUgIT0gMCkge1xuICAgICAgICAgICAgLy8gUmVzaXplIGFjY29yZGluZyB0byBzY2FsaW5nIGluIGRpcmVjdGlvbnNcbiAgICAgICAgICAgIHRoaXMud29ya0J1ZmZlcj8uc2NhbGUobGVmdFNjYWxlLCB1cFNjYWxlLCB0aGlzLndvcmtCdWZmZXIud2lkdGggKyBsZWZ0U2NhbGUgKyByaWdodFNjYWxlLCB0aGlzLndvcmtCdWZmZXIuaGVpZ2h0ICsgdXBTY2FsZSArIGRuU2NhbGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmUtY2FsY3VsYXRlIGNhbnZhcyBzcGFjZSByZWN0XG4gICAgICAgIGlmICh0aGlzLndvcmtCdWZmZXJSZWN0ID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy53b3JrQnVmZmVyUmVjdCA9IFJlY3QuY3JlYXRlKFxuICAgICAgICAgICAgICAgIFZlY3RvcjIuY3JlYXRlKHJlY3QudG9wTGVmdC54IC0gdGhpcy53b3JrQnVmZmVyQ29vcmRpbmF0ZXMueCwgcmVjdC50b3BMZWZ0LnkgLSB0aGlzLndvcmtCdWZmZXJDb29yZGluYXRlcy55KSxcbiAgICAgICAgICAgICAgICBWZWN0b3IyLmNyZWF0ZShyZWN0LmJ0bVJpZ2h0LnggLSB0aGlzLndvcmtCdWZmZXJDb29yZGluYXRlcy54LCByZWN0LmJ0bVJpZ2h0LnkgLSB0aGlzLndvcmtCdWZmZXJDb29yZGluYXRlcy55KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMud29ya0J1ZmZlclJlY3QudG9wTGVmdC54ID0gTWF0aC5taW4odGhpcy53b3JrQnVmZmVyUmVjdC50b3BMZWZ0LngsIHJlY3QudG9wTGVmdC54IC0gdGhpcy53b3JrQnVmZmVyQ29vcmRpbmF0ZXMueCk7XG4gICAgICAgICAgICB0aGlzLndvcmtCdWZmZXJSZWN0LnRvcExlZnQueSA9IE1hdGgubWluKHRoaXMud29ya0J1ZmZlclJlY3QudG9wTGVmdC55LCByZWN0LnRvcExlZnQueSAtIHRoaXMud29ya0J1ZmZlckNvb3JkaW5hdGVzLnkpO1xuICAgICAgICAgICAgdGhpcy53b3JrQnVmZmVyUmVjdC5idG1SaWdodC54ID0gTWF0aC5tYXgodGhpcy53b3JrQnVmZmVyUmVjdC5idG1SaWdodC54ICsgbGVmdFNjYWxlLCByZWN0LmJ0bVJpZ2h0LnggLSB0aGlzLndvcmtCdWZmZXJDb29yZGluYXRlcy54KTtcbiAgICAgICAgICAgIHRoaXMud29ya0J1ZmZlclJlY3QuYnRtUmlnaHQueSA9IE1hdGgubWF4KHRoaXMud29ya0J1ZmZlclJlY3QuYnRtUmlnaHQueSArIHVwU2NhbGUsIHJlY3QuYnRtUmlnaHQueSAtIHRoaXMud29ya0J1ZmZlckNvb3JkaW5hdGVzLnkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQmxpdHMgdGhlIGN1cnJlbnQgYnJ1c2ggdG8gdGhlIHdvcmsgYnVmZmVyIGN1cnJlbnRseSBpbiB1c2VcbiAgICAgKiBAcGFyYW0gcHggQ2VudGVyIFggY29vcmRpbmF0ZVxuICAgICAqIEBwYXJhbSBweSBDZW50ZXIgWSBjb29yZGluYXRlXG4gICAgICovXG4gICAgcHJpdmF0ZSB3cml0ZVN0YW1wVG9Xb3JrQnVmZmVyKHB4OiBudW1iZXIsIHB5OiBudW1iZXIpIHtcbiAgICAgICAgLy8gRG8gbm90IGFsbG93IHdyaXRpbmcgZW1wdHkgc3RhbXBzXG4gICAgICAgIGlmICh0aGlzLnN0YW1wQ29weSA9PSB1bmRlZmluZWQpIHJldHVybjtcblxuICAgICAgICAvLyBDYWxjdWxhdGUgY2FudmFzLXNwYWNlIGNvb3JkaW5hdGVzIGZvciB0aGUgYm91bmRpbmcgcmVjdCBvZiB0aGUgc3RhbXBcbiAgICAgICAgdmFyIHJlY3QgPSBSZWN0LmNyZWF0ZShcbiAgICAgICAgICAgIFZlY3RvcjIuY3JlYXRlKHB4IC0gTWF0aC5mbG9vcih0aGlzLmN1cnJlbnRTY2FsZSAvIDIpLCBweSAtIE1hdGguZmxvb3IodGhpcy5jdXJyZW50U2NhbGUgLyAyKSksXG4gICAgICAgICAgICBWZWN0b3IyLmNyZWF0ZShweCArIE1hdGguY2VpbCh0aGlzLmN1cnJlbnRTY2FsZSAvIDIpLCBweSArIE1hdGguY2VpbCh0aGlzLmN1cnJlbnRTY2FsZSAvIDIpKVxuICAgICAgICApO1xuXG4gICAgICAgIC8vIENyZWF0ZSBidWZmZXIgaWYgbmVjZXNzYXJ5XG4gICAgICAgIGlmICh0aGlzLndvcmtCdWZmZXIgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZU5ld1dvcmtCdWZmZXIoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJlc2l6ZSB0aGUgYnVmZmVyIGFjY29yZGluZ2x5XG4gICAgICAgIHRoaXMucmVzaXplV29ya0J1ZmZlcihyZWN0KTtcblxuICAgICAgICAvLyBCbGl0IGNvbnRlbnRzIG9mIHRoZSBzdGFtcCB0byB0aGUgd29yayBidWZmZXJcbiAgICAgICAgdmFyIHhDb29yZCA9IHJlY3QudG9wTGVmdC54IC0gdGhpcy53b3JrQnVmZmVyQ29vcmRpbmF0ZXMhLng7XG4gICAgICAgIHZhciB5Q29vcmQgPSByZWN0LnRvcExlZnQueSAtIHRoaXMud29ya0J1ZmZlckNvb3JkaW5hdGVzIS55O1xuXG4gICAgICAgIHRoaXMud29ya0J1ZmZlciEuYmxpdCh0aGlzLnN0YW1wQ29weSwgeENvb3JkLCB5Q29vcmQsIDAsIDAsIHRoaXMuc3RhbXBDb3B5LndpZHRoLCB0aGlzLnN0YW1wQ29weS5oZWlnaHQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFdyaXRlcyB0aGUgd29yayBidWZmZXIgdG8gdGhlIFBpY3RvcHVwIGluc3RhbmNlXG4gICAgICovXG4gICAgcHJpdmF0ZSBjb21taXRXb3JrQnVmZmVyKCkge1xuICAgICAgICBpZiAodGhpcy53b3JrQnVmZmVyID09IHVuZGVmaW5lZCkgcmV0dXJuO1xuICAgICAgICBpZiAodGhpcy53b3JrQnVmZmVyQ29vcmRpbmF0ZXMgPT0gdW5kZWZpbmVkKSByZXR1cm47XG5cbiAgICAgICAgLy8gTGV0J3MgY2FsY3VsYXRlIGhvdyBtdWNoIHNwYWNlIGlzIGFjdHVhbGx5IG5lZWRlZCB0byBiZSB3cml0dGVuXG5cbiAgICAgICAgLy8gVE9ETzogQ3JlYXRlIGNhbnZhcyBhY3Rpb24sIHByb3Blcmx5IHdyaXRlIG91dC5cbiAgICAgICAgLy8gV2UgYXJlIGp1c3QgZ29pbmcgdG8gY29weSB3aGF0IHdlIGNhbiByaWdodCBub3dcbiAgICAgICAgdGhpcy5waWN0by5pbWFnZUJ1ZmZlci5ibGl0KFxuICAgICAgICAgICAgdGhpcy53b3JrQnVmZmVyISxcbiAgICAgICAgICAgIHRoaXMud29ya0J1ZmZlckNvb3JkaW5hdGVzIS54LFxuICAgICAgICAgICAgdGhpcy53b3JrQnVmZmVyQ29vcmRpbmF0ZXMhLnksXG4gICAgICAgICAgICB0aGlzLndvcmtCdWZmZXJSZWN0IS50b3BMZWZ0LngsXG4gICAgICAgICAgICB0aGlzLndvcmtCdWZmZXJSZWN0IS50b3BMZWZ0LnksXG4gICAgICAgICAgICB0aGlzLndvcmtCdWZmZXJSZWN0IS53aWR0aCgpLFxuICAgICAgICAgICAgdGhpcy53b3JrQnVmZmVyUmVjdCEuaGVpZ2h0KClcbiAgICAgICAgKTtcblxuICAgICAgICAvLyBFcmFzZSBjdXJyZW50IHdvcmsgYnVmZmVyXG4gICAgICAgIGRlbGV0ZSB0aGlzLndvcmtCdWZmZXI7XG4gICAgICAgIGRlbGV0ZSB0aGlzLndvcmtCdWZmZXJDb29yZGluYXRlcztcbiAgICAgICAgZGVsZXRlIHRoaXMud29ya0J1ZmZlclJlY3Q7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTG9hZHMgYW4gaW1hZ2UgaW50byB0aGUgbWFzdGVyIHN0YW1wIHNsb3QgYXMgd2VsbCBhcyBpdHMgdHJhbnNmb3JtZWQgY29weVxuICAgICAqIEFueSBibGFjayBwaXhlbHMgYXJlIGludGVycHJldGVkIGFzIFxuICAgICAqIEBwYXJhbSBpbWFnZSBJbWFnZSB0byB1c2UgYXMgdGhlIHN0YW1wXG4gICAgICovXG4gICAgbG9hZFN0YW1wRnJvbUltYWdlRGF0YShpbWFnZTogSW1hZ2VEYXRhKSB7XG4gICAgICAgIHZhciBwaXhlbEFycmF5OiBVaW50MzJBcnJheSA9IG5ldyBVaW50MzJBcnJheShpbWFnZS5kYXRhLmJ1ZmZlcik7XG5cbiAgICAgICAgdGhpcy5zdGFtcCA9IG5ldyBQaXhlbEJ1ZmZlcihpbWFnZS53aWR0aCwgaW1hZ2UuaGVpZ2h0KTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBpeGVsQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuc3RhbXAuYXJyW2ldID0gKChwaXhlbEFycmF5W2ldICYgMHhGRjAwMDAwMCkgPT0gMCkgPyBQYWxldHRlSW5kZXguUEFMRVRURV9NQVNLIDogdGhpcy5jdXJyZW50Q29sb3I7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnN0YW1wQ29weSA9IHRoaXMuc3RhbXAuY2xvbmUoKTtcbiAgICAgICAgdGhpcy5zZXRTY2FsZSh0aGlzLmN1cnJlbnRTY2FsZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgcGl4ZWwgY29sb3Igb2YgdGhlIHN0YW1wIGNvcHlcbiAgICAgKiBAcGFyYW0gY29sb3IgUGFsZXR0ZSBjb2xvciB0byB1c2VcbiAgICAgKi9cbiAgICBzZXRDb2xvcihjb2xvcjogUGFsZXR0ZUluZGV4KSB7XG4gICAgICAgIGlmICh0aGlzLnN0YW1wQ29weSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zdGFtcENvcHkuYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhbXBDb3B5LmFycltpXSAhPSBQYWxldHRlSW5kZXguUEFMRVRURV9NQVNLKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhbXBDb3B5LmFycltpXSA9IGNvbG9yO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY3VycmVudENvbG9yID0gY29sb3I7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2NhbGVzIHRoZSBkZXNpcmVkIG91dHB1dCBzdGFtcCB0byBhIG5ldyBzaXplXG4gICAgICogQHBhcmFtIHNjYWxlIEhlaWdodCBpbiBwaXhlbHNcbiAgICAgKi9cbiAgICBzZXRTY2FsZShzY2FsZTogbnVtYmVyKSB7XG4gICAgICAgIGlmICh0aGlzLnN0YW1wICE9IHVuZGVmaW5lZCkge1xuXG4gICAgICAgICAgICB2YXIgbmV3V2lkdGg6IG51bWJlciA9IE1hdGguZmxvb3IoKHRoaXMuc3RhbXAud2lkdGggLyB0aGlzLnN0YW1wLmhlaWdodCkgKiBzY2FsZSk7XG4gICAgICAgICAgICB2YXIgbmV3SGVpZ2h0OiBudW1iZXIgPSBzY2FsZTtcblxuICAgICAgICAgICAgdmFyIHJXID0gdGhpcy5zdGFtcC53aWR0aCAvIG5ld1dpZHRoO1xuICAgICAgICAgICAgdmFyIHJIID0gdGhpcy5zdGFtcC5oZWlnaHQgLyBuZXdIZWlnaHQ7XG5cbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLnN0YW1wQ29weTtcbiAgICAgICAgICAgIHRoaXMuc3RhbXBDb3B5ID0gbmV3IFBpeGVsQnVmZmVyKG5ld1dpZHRoLCBuZXdIZWlnaHQpO1xuICAgICAgICAgICAgdGhpcy5zdGFtcENvcHkuYXJyLmZpbGwoUGFsZXR0ZUluZGV4LlBBTEVUVEVfTUFTSywgMCwgdGhpcy5zdGFtcENvcHkuYXJyLmxlbmd0aCk7XG5cbiAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgbmV3V2lkdGg7IHgrKykge1xuICAgICAgICAgICAgICAgIHZhciBzWCA9IE1hdGguZmxvb3IoclcgKiB4KTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciB5ID0gMDsgeSA8IG5ld0hlaWdodDsgeSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzWSA9IE1hdGguZmxvb3IockggKiB5KTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5zdGFtcC5hcnJbc1ggKyBzWSAqIHRoaXMuc3RhbXAud2lkdGhdICE9IFBhbGV0dGVJbmRleC5QQUxFVFRFX01BU0spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhbXBDb3B5LmFyclt4ICsgeSAqIG5ld1dpZHRoXSA9IHRoaXMuY3VycmVudENvbG9yO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jdXJyZW50U2NhbGUgPSBzY2FsZTtcbiAgICB9XG5cbiAgICBwcm9jZXNzSW5wdXRFdmVudChldmVudDogSW5wdXRFdmVudCk6IHZvaWQge1xuICAgICAgICBpZiAoZXZlbnQgaW5zdGFuY2VvZiBNb3VzZUV2ZW50KSB7XG4gICAgICAgICAgICB2YXIgbW91c2VQb3MgPSB0aGlzLnBpY3RvLnNzVG9DYW52YXNDb29yZGluYXRlKGV2ZW50LmNsaWVudFgsIGV2ZW50LmNsaWVudFkpO1xuXG4gICAgICAgICAgICBpZiAoIXRoaXMubG9ja0lucHV0KSB7XG4gICAgICAgICAgICAgICAgLy8gQmVnaW4gZHJhd1xuICAgICAgICAgICAgICAgIGlmIChldmVudC50eXBlID09IFwibW91c2Vkb3duXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2NrSW5wdXQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZU5ld1dvcmtCdWZmZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53cml0ZVN0YW1wVG9Xb3JrQnVmZmVyKG1vdXNlUG9zLngsIG1vdXNlUG9zLnkpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxhc3RNb3VzZVBvcyA9IG1vdXNlUG9zO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50LnR5cGUgPT0gXCJtb3VzZW1vdmVcIikge1xuICAgICAgICAgICAgICAgICAgICAvLyBEcmF3IGxpbmUgZnJvbSBwb2ludCBBIHRvIHBvaW50IEJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRlbHRhOiBWZWN0b3IyID0gVmVjdG9yMi5jcmVhdGUobW91c2VQb3MueCAtIHRoaXMubGFzdE1vdXNlUG9zIS54LCBtb3VzZVBvcy55IC0gdGhpcy5sYXN0TW91c2VQb3MhLnkpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgdG9wID0gTWF0aC5tYXgoTWF0aC5hYnMoZGVsdGEueCksIE1hdGguYWJzKGRlbHRhLnkpKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodG9wID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMud3JpdGVTdGFtcFRvV29ya0J1ZmZlcihtb3VzZVBvcy54LCBtb3VzZVBvcy55KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB4UmF0aW8gPSBkZWx0YS54IC8gdG9wO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHlSYXRpbyA9IGRlbHRhLnkgLyB0b3A7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDw9IHRvcDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy53cml0ZVN0YW1wVG9Xb3JrQnVmZmVyKG1vdXNlUG9zLnggLSBNYXRoLmZsb29yKGkgKiB4UmF0aW8pLCBtb3VzZVBvcy55IC0gTWF0aC5mbG9vcihpICogeVJhdGlvKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxhc3RNb3VzZVBvcyA9IG1vdXNlUG9zO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIEVuZCBkcmF3XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoZXZlbnQudHlwZSA9PSBcIm1vdXNldXBcIikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbW1pdFdvcmtCdWZmZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2NrSW5wdXQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyByZW5kZXIoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIC8vIE5PIG5lZWQgdG8gY29weSBvdXQgYW55dGhpbmcgaWYgbm90IGN1cnJlbnRseSB1c2luZyB0aGUgdG9vbFxuICAgICAgICBpZiAoIXRoaXMubG9ja0lucHV0KSByZXR1cm47XG5cbiAgICAgICAgaWYgKHRoaXMud29ya0J1ZmZlciAhPSB1bmRlZmluZWQgJiYgdGhpcy53b3JrQnVmZmVyQ29vcmRpbmF0ZXMgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLnBpY3RvLndvcmtCdWZmZXIuYmxpdChcbiAgICAgICAgICAgICAgICB0aGlzLndvcmtCdWZmZXIhLFxuICAgICAgICAgICAgICAgIHRoaXMud29ya0J1ZmZlckNvb3JkaW5hdGVzLngsXG4gICAgICAgICAgICAgICAgdGhpcy53b3JrQnVmZmVyQ29vcmRpbmF0ZXMueSxcbiAgICAgICAgICAgICAgICB0aGlzLndvcmtCdWZmZXJSZWN0IS50b3BMZWZ0LngsXG4gICAgICAgICAgICAgICAgdGhpcy53b3JrQnVmZmVyUmVjdCEudG9wTGVmdC55LFxuICAgICAgICAgICAgICAgIHRoaXMud29ya0J1ZmZlclJlY3QhLndpZHRoKCksXG4gICAgICAgICAgICAgICAgdGhpcy53b3JrQnVmZmVyUmVjdCEuaGVpZ2h0KClcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG59Il0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7OztBQ3NCTyxNQUFNLFVBQU4sTUFBYztBQUFBO0FBQUE7QUFBQTtBQUFBLElBT2pCLGNBQWM7QUFMZDtBQUFBO0FBTUksV0FBSyxTQUFTLElBQUksWUFBWTtBQUFBLFFBQzFCO0FBQUE7QUFBQSxRQUNBO0FBQUE7QUFBQSxRQUNBO0FBQUE7QUFBQSxRQUNBO0FBQUE7QUFBQSxRQUNBO0FBQUE7QUFBQSxRQUNBO0FBQUE7QUFBQSxRQUNBO0FBQUE7QUFBQSxRQUNBO0FBQUE7QUFBQSxRQUNBO0FBQUE7QUFBQSxRQUNBO0FBQUE7QUFBQSxRQUNBO0FBQUE7QUFBQSxRQUNBO0FBQUE7QUFBQSxRQUNBO0FBQUE7QUFBQSxRQUNBO0FBQUE7QUFBQSxRQUNBO0FBQUE7QUFBQSxRQUNBO0FBQUE7QUFBQSxNQUNKLENBQUM7QUFBQSxJQUNMO0FBQUEsRUFDSjs7O0FDNUNPLE1BQU0sY0FBTixNQUFNLGFBQVk7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFhckIsWUFBWSxJQUFZLElBQVk7QUFYcEM7QUFBQTtBQUVBO0FBQUE7QUFFQTtBQUFBO0FBUUksV0FBSyxNQUFNLElBQUksVUFBVSxLQUFLLEVBQUU7QUFDaEMsV0FBSyxRQUFRO0FBQ2IsV0FBSyxTQUFTO0FBQUEsSUFDbEI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBTUEsUUFBcUI7QUFDakIsVUFBSSxZQUF5QixJQUFJLGFBQVksS0FBSyxPQUFPLEtBQUssTUFBTTtBQUNwRSxnQkFBVSxNQUFNLEtBQUssSUFBSSxNQUFN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
