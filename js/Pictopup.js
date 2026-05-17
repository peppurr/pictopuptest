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
  };

  // src/Pictopup/Tools/StampTool.ts
  var BUFFER_PADDING_SIZE = 50;
  var StampTool = class {
    constructor(picto) {
      __publicField(this, "lockInput");
      __publicField(this, "picto");
      __publicField(this, "currentColor");
      __publicField(this, "currentScale");
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
        this.workBufferCoordinates = rect.topLeft;
      }
      if (this.workBufferRect == void 0) {
        this.workBufferRect = rect;
      } else {
        this.workBufferRect.topLeft.x = Math.min(this.workBufferRect.topLeft.x, rect.topLeft.x);
        this.workBufferRect.topLeft.y = Math.min(this.workBufferRect.topLeft.y, rect.topLeft.y);
        this.workBufferRect.btmRight.x = Math.max(this.workBufferRect.btmRight.x, rect.btmRight.x);
        this.workBufferRect.btmRight.y = Math.max(this.workBufferRect.btmRight.y, rect.btmRight.y);
      }
      var leftScale = 0;
      var rightScale = 0;
      var upScale = 0;
      var dnScale = 0;
      if (rect.topLeft.x < this.workBufferCoordinates.x) {
        leftScale = Math.max(BUFFER_PADDING_SIZE, this.workBufferCoordinates.x - rect.topLeft.x);
      }
      if (rect.btmRight.x >= this.workBufferCoordinates.x + this.workBuffer.width) {
        rightScale = Math.max(BUFFER_PADDING_SIZE, rect.btmRight.x - (this.workBufferCoordinates.x + this.workBuffer.width));
      }
      if (rect.topLeft.y < this.workBufferCoordinates.y) {
        upScale = Math.max(BUFFER_PADDING_SIZE, this.workBufferCoordinates.y - rect.topLeft.y);
      }
      if (rect.btmRight.y >= this.workBufferCoordinates.y + this.workBuffer.height) {
        dnScale = Math.max(BUFFER_PADDING_SIZE, rect.btmRight.y - (this.workBufferCoordinates.y + this.workBuffer.height));
      }
      if (leftScale + rightScale + upScale + dnScale == 0) return;
      (_a = this.workBuffer) == null ? void 0 : _a.scale(leftScale, upScale, this.workBuffer.width + leftScale + rightScale, this.workBuffer.height + upScale + dnScale);
      this.workBufferCoordinates.sub(Vector2.create(leftScale, upScale));
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
      this.picto.imageBuffer.blit(
        this.workBuffer,
        this.workBufferCoordinates.x,
        this.workBufferCoordinates.y,
        0,
        0,
        this.workBuffer.width,
        this.workBuffer.height
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
       * Palette currently being used for output image
       */
      __publicField(this, "palette");
      __publicField(this, "canvas");
      __publicField(this, "ctx");
      this.palette = new Palette();
      this.imageBuffer = new PixelBuffer(270, 180);
      this.canvas = document.createElement("canvas");
      this.canvas.width = this.imageBuffer.width;
      this.canvas.height = this.imageBuffer.height;
      this.ctx = this.canvas.getContext("2d");
      div.appendChild(this.canvas);
    }
    /**
     * Transforms screenspace coordinates into pixel coordinates on the canvas
     * @param mx Mouse position X in screen space
     * @param my Mouse position Y in screen space
     */
    ssToCanvasCoordinate(mx, my) {
      var bounds = this.canvas.getBoundingClientRect();
      return Vector2.create(
        (mx - bounds.x) * this.imageBuffer.width / bounds.width,
        (my - bounds.y) * this.imageBuffer.height / bounds.height
      );
    }
    render() {
      return __async(this, null, function* () {
        var buffer = yield this.imageBuffer.rasterize(this.palette);
        this.ctx.drawImage(buffer, 0, 0);
      });
    }
  };
  return __toCommonJS(Pictopup_exports);
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjL1BpY3RvcHVwL1BpY3RvcHVwLnRzIiwgIi4uLy4uL3NyYy9QaWN0b3B1cC9QYWxldHRlLnRzIiwgIi4uLy4uL3NyYy9QaWN0b3B1cC9QaXhlbEJ1ZmZlci50cyIsICIuLi8uLi9zcmMvUGljdG9wdXAvR2VvbWV0cnkudHMiLCAiLi4vLi4vc3JjL1BpY3RvcHVwL1Rvb2xzL1N0YW1wVG9vbC50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiaW1wb3J0IHsgUGl4ZWxCdWZmZXIgfSBmcm9tIFwiLi9QaXhlbEJ1ZmZlclwiO1xuaW1wb3J0IHsgUGFsZXR0ZSB9IGZyb20gXCIuL1BhbGV0dGVcIjtcbmltcG9ydCB7IEJhc2VUb29sIH0gZnJvbSBcIi4vVG9vbHMvQmFzZVRvb2wudHNcIjtcbmltcG9ydCB7IFN0YW1wVG9vbCB9IGZyb20gXCIuL1Rvb2xzL1N0YW1wVG9vbC50c1wiO1xuaW1wb3J0IHsgVmVjdG9yMiB9IGZyb20gXCIuL0dlb21ldHJ5LnRzXCI7XG5cbmV4cG9ydCB7IFBhbGV0dGUsIFBpeGVsQnVmZmVyLCBTdGFtcFRvb2wgfVxuXG4vKipcbiAqIEFuIGluc3RhbmNlIG9mIHRoZSBQaWN0b3B1cCBpbWFnZSBlZGl0b3JcbiAqL1xuZXhwb3J0IGNsYXNzIFBpY3RvcHVwIHtcbiAgICAvKipcbiAgICAgKiBUb29sIGJlaW5nIHVzZWQgYnkgdGhlIHVzZXJcbiAgICAgKi9cbiAgICBjdXJyZW50VG9vbD86IEJhc2VUb29sO1xuXG4gICAgLyoqXG4gICAgICogSW1hZ2UgYnVmZmVyIGNvbnRhaW5pbmcgY29tbWl0dGVkIHBpeGVsIGRhdGFcbiAgICAgKi9cbiAgICBpbWFnZUJ1ZmZlcjogUGl4ZWxCdWZmZXI7XG5cbiAgICAvKipcbiAgICAgKiBQYWxldHRlIGN1cnJlbnRseSBiZWluZyB1c2VkIGZvciBvdXRwdXQgaW1hZ2VcbiAgICAgKi9cbiAgICBwYWxldHRlOiBQYWxldHRlO1xuXG4gICAgcHJpdmF0ZSBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50O1xuICAgIHByaXZhdGUgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgbmV3IGluc3RhbmNlIG9mIHRoZSBQaWN0b3B1cCBpbWFnZSBlZGl0b3JcbiAgICAgKiBAcGFyYW0gZGl2IERpdiB0byBwYXJlbnQgdGhlIGVkaXRvciB0b1xuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGRpdjogSFRNTERpdkVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy5wYWxldHRlID0gbmV3IFBhbGV0dGUoKTtcbiAgICAgICAgdGhpcy5pbWFnZUJ1ZmZlciA9IG5ldyBQaXhlbEJ1ZmZlcigyNzAsIDE4MCk7XG5cbiAgICAgICAgLy8gQnVpbGQgSFRNTFxuICAgICAgICB0aGlzLmNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG4gICAgICAgIHRoaXMuY2FudmFzLndpZHRoID0gdGhpcy5pbWFnZUJ1ZmZlci53aWR0aDtcbiAgICAgICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gdGhpcy5pbWFnZUJ1ZmZlci5oZWlnaHQ7XG5cbiAgICAgICAgdGhpcy5jdHggPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpIGFzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcblxuICAgICAgICBkaXYuYXBwZW5kQ2hpbGQodGhpcy5jYW52YXMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRyYW5zZm9ybXMgc2NyZWVuc3BhY2UgY29vcmRpbmF0ZXMgaW50byBwaXhlbCBjb29yZGluYXRlcyBvbiB0aGUgY2FudmFzXG4gICAgICogQHBhcmFtIG14IE1vdXNlIHBvc2l0aW9uIFggaW4gc2NyZWVuIHNwYWNlXG4gICAgICogQHBhcmFtIG15IE1vdXNlIHBvc2l0aW9uIFkgaW4gc2NyZWVuIHNwYWNlXG4gICAgICovXG4gICAgc3NUb0NhbnZhc0Nvb3JkaW5hdGUobXg6IG51bWJlciwgbXk6IG51bWJlcik6IFZlY3RvcjIge1xuICAgICAgICB2YXIgYm91bmRzOiBET01SZWN0ID0gdGhpcy5jYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICAgICAgcmV0dXJuIFZlY3RvcjIuY3JlYXRlKFxuICAgICAgICAgICAgKG14ICAtIGJvdW5kcy54KSAqIHRoaXMuaW1hZ2VCdWZmZXIud2lkdGggLyBib3VuZHMud2lkdGgsXG4gICAgICAgICAgICAobXkgIC0gYm91bmRzLnkpICogdGhpcy5pbWFnZUJ1ZmZlci5oZWlnaHQgLyBib3VuZHMuaGVpZ2h0XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgYXN5bmMgcmVuZGVyKCkge1xuICAgICAgICAvLyBEcmF3IGltYWdlIGJ1ZmZlciB0byBjYW52YXMgYXMgZmlyc3QgbGF5ZXJcbiAgICAgICAgdmFyIGJ1ZmZlcjogSW1hZ2VCaXRtYXAgPSBhd2FpdCB0aGlzLmltYWdlQnVmZmVyLnJhc3Rlcml6ZSh0aGlzLnBhbGV0dGUpO1xuXG4gICAgICAgIHRoaXMuY3R4LmRyYXdJbWFnZShidWZmZXIsIDAsIDApO1xuICAgIH1cbn1cbiIsICJleHBvcnQgZW51bSBQYWxldHRlSW5kZXgge1xuICAgIFBBTEVUVEVfMCA9IDB4MCxcbiAgICBQQUxFVFRFX0JBQ0tHUk9VTkQgPSBQQUxFVFRFXzAsIC8vIGRlZmluZSBiYWNrZ3JvdW5kIGxheWVyXG4gICAgUEFMRVRURV8xID0gMHgxLFxuICAgIFBBTEVUVEVfMiA9IDB4MixcbiAgICBQQUxFVFRFXzMgPSAweDMsXG4gICAgUEFMRVRURV80ID0gMHg0LFxuICAgIFBBTEVUVEVfNSA9IDB4NSxcbiAgICBQQUxFVFRFXzYgPSAweDYsXG4gICAgUEFMRVRURV83ID0gMHg3LFxuICAgIFBBTEVUVEVfOCA9IDB4OCxcbiAgICBQQUxFVFRFXzkgPSAweDksXG4gICAgUEFMRVRURV9BID0gMHhBLFxuICAgIFBBTEVUVEVfQiA9IDB4QixcbiAgICBQQUxFVFRFX0MgPSAweEMsXG4gICAgUEFMRVRURV9EID0gMHhELFxuICAgIFBBTEVUVEVfRSA9IDB4RSxcbiAgICBQQUxFVFRFX0YgPSAweEYsXG4gICAgUEFMRVRURV9MQVNUID0gUEFMRVRURV9GLFxuICAgIFBBTEVUVEVfTUFTSyA9IC0xXG59XG5cbmV4cG9ydCBjbGFzcyBQYWxldHRlIHtcbiAgICAvKiogQXJyYXkgb2YgcGFsZXR0ZSBjb2xvcnMsIHN0b3JlZCBhcyBSR0JBICovXG4gICAgY29sb3JzOiBVaW50MzJBcnJheTtcblxuICAgIC8qKlxuICAgICAqIEJ1aWxkcyBhIG5ldyBQYWxldHRlIG9iamVjdCBhbmQgc2V0cyB0aGUgZGVmYXVsdCBjb2xvcnNcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5jb2xvcnMgPSBuZXcgVWludDMyQXJyYXkoW1xuICAgICAgICAgICAgMHhGRkZGRkZGRiwgLy8gI0ZGRkZGRkZGXG4gICAgICAgICAgICAweEZGMDAwMDAwLCAvLyAjMDAwMDAwRkZcbiAgICAgICAgICAgIDB4RkY1NTU1NTUsIC8vICM1NTU1NTVGRlxuICAgICAgICAgICAgMHhGRkFBQUFBQSwgLy8gI0FBQUFBQUZGXG4gICAgICAgICAgICAweEZGMDAwMEZGLCAvLyAjRkYwMDAwRkZcbiAgICAgICAgICAgIDB4RkYwMDgwRkYsIC8vICNGRjgwMDBGRlxuICAgICAgICAgICAgMHhGRjAwRkZGRiwgLy8gI0ZGRkYwMEZGXG4gICAgICAgICAgICAweEZGMDBGRjgwLCAvLyAjODBGRjAwRkZcbiAgICAgICAgICAgIDB4RkYwMEZGMDAsIC8vICMwMEZGMDBGRlxuICAgICAgICAgICAgMHhGRjgwRkYwMCwgLy8gIzAwRkY4MEZGXG4gICAgICAgICAgICAweEZGRkZGRjAwLCAvLyAjMDBGRkZGRkZcbiAgICAgICAgICAgIDB4RkZGRjgwMDAsIC8vICMwMDgwRkZGRlxuICAgICAgICAgICAgMHhGRkZGMDAwMCwgLy8gIzAwMDBGRkZGXG4gICAgICAgICAgICAweEZGRkYwMDgwLCAvLyAjODAwMEZGRkZcbiAgICAgICAgICAgIDB4RkZGRjAwRkYsIC8vICNGRjAwRkZGRlxuICAgICAgICAgICAgMHhGRjgwMDBGRiAvLyAjRkYwMDgwRkZcbiAgICAgICAgXSk7XG4gICAgfVxufSIsICJpbXBvcnQgeyBQYWxldHRlLCBQYWxldHRlSW5kZXggfSBmcm9tIFwiLi9QYWxldHRlXCI7XG5cbi8qKlxuICogQSBidWZmZXIgY29udGFpbmluZyBwYWxldHRlIGluZGljZXMgYXMgcGl4ZWwgaW5mb3JtYXRpb25cbiAqL1xuZXhwb3J0IGNsYXNzIFBpeGVsQnVmZmVyIHtcbiAgICAvKiogQXJyYXkgb2YgcGFsZXR0ZSBpbmRpY2VzICovXG4gICAgYXJyOiBJbnQ4QXJyYXk7XG4gICAgLyoqIFdpZHRoIG9mIGJ1ZmZlciAqL1xuICAgIHdpZHRoOiBudW1iZXI7XG4gICAgLyoqIEhlaWdodCBvZiBidWZmZXIgKi9cbiAgICBoZWlnaHQ6IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBuZXcgYnVmZmVyIG9mIGEgc3BlY2lmaWVkIHNpemVcbiAgICAgKiBAcGFyYW0gc3ggU2l6ZSBYXG4gICAgICogQHBhcmFtIHN5IFNpemUgWVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHN4OiBudW1iZXIsIHN5OiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5hcnIgPSBuZXcgSW50OEFycmF5KHN4ICogc3kpO1xuICAgICAgICB0aGlzLndpZHRoID0gc3g7XG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gc3k7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIGR1cGxpY2F0ZSBQaXhlbEJ1ZmZlciBvYmplY3QgYmFzZWQgb24gYW4gZXhpc3Rpbmcgb25lXG4gICAgICogQHJldHVybnMgRHVwbGljYXRlZCBwaXhlbCBidWZmZXJcbiAgICAgKi9cbiAgICBjbG9uZSgpOiBQaXhlbEJ1ZmZlciB7XG4gICAgICAgIHZhciByZXRCdWZmZXI6IFBpeGVsQnVmZmVyID0gbmV3IFBpeGVsQnVmZmVyKHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcbiAgICAgICAgcmV0QnVmZmVyLmFyciA9IHRoaXMuYXJyLnNsaWNlKCk7XG4gICAgICAgIHJldHVybiByZXRCdWZmZXI7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ29waWVzIHBpeGVsIGRhdGEgZnJvbSBhbm90aGVyIGJ1ZmZlciBpbnRvIHRoaXMgb25lXG4gICAgICogQm91bmRhcmllcyB3aWxsIGF1dG9tYXRpY2FsbHkgYmUgYXBwbGllZCB0byB0aGlzIGJ1ZmZlclxuICAgICAqIEVuc3VyZSB0aGF0IHNvdXJjZSBpbmRpY2VzIGRvIG5vdCBvdmVycnVuIG9yIGlzc3VlcyB3aWxsIGFyaXNlXG4gICAgICogQHBhcmFtIGJ1ZmZlciBCdWZmZXIgdG8gY29weSBpbmZvcm1hdGlvbiBmcm9tXG4gICAgICogQHBhcmFtIGR4IERlc3RpbmF0aW9uIFhcbiAgICAgKiBAcGFyYW0gZHkgRGVzdGluYXRpb24gWVxuICAgICAqIEBwYXJhbSBzeCBTb3VyY2UgWFxuICAgICAqIEBwYXJhbSBzeSBTb3VyY2UgWVxuICAgICAqIEBwYXJhbSBzdyBTb3VyY2Ugd2lkdGhcbiAgICAgKiBAcGFyYW0gc2ggU291cmNlIGhlaWdodFxuICAgICAqIEBwYXJhbSBtYXNrIE1hc2sgcGl4ZWwgdmFsdWUsIHRoZSBtYXNrIHdpbGwgbm90IGJlIGNvcGllZCBvdmVyIGlmIHNldFxuICAgICAqL1xuICAgIGJsaXQoYnVmZmVyOiBQaXhlbEJ1ZmZlciwgZHg6IG51bWJlciwgZHk6IG51bWJlciwgc3g6IG51bWJlciwgc3k6IG51bWJlciwgc3c6IG51bWJlciwgc2g6IG51bWJlciwgbWFzazogbnVtYmVyID0gUGFsZXR0ZUluZGV4LlBBTEVUVEVfTUFTSyk6IHZvaWQge1xuICAgICAgICB2YXIgbWF4RHg6IG51bWJlciA9IE1hdGgubWluKHRoaXMud2lkdGgsIGR4ICsgc3cpO1xuICAgICAgICB2YXIgbWF4RHk6IG51bWJlciA9IE1hdGgubWluKHRoaXMuaGVpZ2h0LCBkeSArIHNoKTtcblxuICAgICAgICBzdyA9IE1hdGgubWluKHN3LCBidWZmZXIud2lkdGggLSBzeCk7XG4gICAgICAgIHNoID0gTWF0aC5taW4oc2gsIGJ1ZmZlci5oZWlnaHQgLSBzeSk7XG5cbiAgICAgICAgZm9yICh2YXIgaVggPSAwOyBpWCA8IHN3OyBpWCsrKSB7XG4gICAgICAgICAgICB2YXIgaUR4ID0gZHggKyBpWDtcbiAgICAgICAgICAgIGlmIChpRHggPCAwIHx8IGlEeCA+PSBtYXhEeCkgY29udGludWU7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGlZID0gMDsgaVkgPCBzaDsgaVkrKykge1xuICAgICAgICAgICAgICAgIHZhciBpRHkgPSBkeSArIGlZO1xuICAgICAgICAgICAgICAgIGlmIChpRHkgPCAwIHx8IGlEeSA+IG1heER5KSBjb250aW51ZTtcblxuICAgICAgICAgICAgICAgIHZhciBwaXhlbCA9IGJ1ZmZlci5hcnJbc3ggKyBpWCArIChzeSArIGlZKSAqIGJ1ZmZlci53aWR0aF07XG5cbiAgICAgICAgICAgICAgICBpZiAocGl4ZWwgIT0gbWFzaykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFycltpRHggKyBpRHkgKiB0aGlzLndpZHRoXSA9IHBpeGVsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRha2VzIGEgcG9ydGlvbiBvZiB0aGUgcGl4ZWwgYnVmZmVyIGFuZCBjcmVhdGVzIGEgbmV3IGJ1ZmZlciB3aXRoIGl0cyBjb250ZW50c1xuICAgICAqIEBwYXJhbSBweCBQb3NpdGlvbiBYXG4gICAgICogQHBhcmFtIHB5IFBvc2l0aW9uIFlcbiAgICAgKiBAcGFyYW0gd2lkdGggV2lkdGggb2Ygc2xpY2VcbiAgICAgKiBAcGFyYW0gaGVpZ2h0IEhlaWdodCBvZiBzbGljZVxuICAgICAqIEByZXR1cm5zIE5ldyBwaXhlbCBidWZmZXIgbWFkZSBvZiB0aGUgcG9ydGlvbiBzbGljZWRcbiAgICAgKi9cbiAgICBzbGljZShweDogbnVtYmVyLCBweTogbnVtYmVyLCB3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlcik6IFBpeGVsQnVmZmVyIHtcbiAgICAgICAgaWYgKHB4ICsgd2lkdGggPiB0aGlzLndpZHRoKSB3aWR0aCA9IHRoaXMud2lkdGggLSBweDtcbiAgICAgICAgaWYgKHB5ICsgaGVpZ2h0ID4gdGhpcy5oZWlnaHQpIGhlaWdodCA9IHRoaXMuaGVpZ2h0IC0gcHk7XG5cbiAgICAgICAgdmFyIGJ1ZmZlcjogUGl4ZWxCdWZmZXIgPSBuZXcgUGl4ZWxCdWZmZXIod2lkdGgsIGhlaWdodCk7XG5cbiAgICAgICAgZm9yICh2YXIgaVggPSBweDsgaVggPCBweCArIHdpZHRoOyBpWCsrKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpWSA9IHB5OyBpWSA8IHB5ICsgaGVpZ2h0OyBpWSsrKSB7XG4gICAgICAgICAgICAgICAgYnVmZmVyLmFycltpWCAtIHB4ICsgKGlZIC0gcHkpICogd2lkdGhdID0gdGhpcy5hcnJbaVggKyBpWSAqIHRoaXMud2lkdGhdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGJ1ZmZlcjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXNpemVzIHRoZSBidWZmZXIsIGNvcHlpbmcgdGhlIGluZm9ybWF0aW9uIGN1cnJlbnRseSBzdG9yZWQgd2l0aGluIGludG9cbiAgICAgKiB0aGUgY29vcmRpbmF0ZXMgc3BlY2lmaWVkIGF0IChweCwgcHkpLlxuICAgICAqIFxuICAgICAqIEFueSBlbXB0eSBjb29yZGluYXRlcyBhcmUgd3JpdHRlbiBhcyBQQUxFVFRFX01BU0tcbiAgICAgKiBAcGFyYW0gZHggWCBjb29yZGluYXRlIHRvIGJsaXQgY29udGVudHMgdG8gaW4gcmVzaXplZCBidWZmZXJcbiAgICAgKiBAcGFyYW0gZHkgWSBjb29yZGluYXRlIHRvIGJsaXQgY29udGVudHMgdG8gaW4gcmVzaXplZCBidWZmZXJcbiAgICAgKiBAcGFyYW0gd2lkdGggV2lkdGggb2YgbmV3IGJ1ZmZlclxuICAgICAqIEBwYXJhbSBoZWlnaHQgSGVpZ2h0IG9mIG5ldyBidWZmZXJcbiAgICAgKi9cbiAgICBzY2FsZShkeDogbnVtYmVyLCBkeTogbnVtYmVyLCB3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlcik6IHZvaWQge1xuICAgICAgICB2YXIgbmV3QXJyYXkgPSBuZXcgSW50OEFycmF5KHdpZHRoICogaGVpZ2h0KTtcbiAgICAgICAgbmV3QXJyYXkuZmlsbChQYWxldHRlSW5kZXguUEFMRVRURV9NQVNLKTtcblxuICAgICAgICAvLyBDYWxjdWxhdGUgYm91bmRzIGZvciBidWZmZXIgY29weVxuICAgICAgICB2YXIgc1g6IG51bWJlciA9IE1hdGgubWluKHdpZHRoIC0gZHgsIHRoaXMud2lkdGgpO1xuICAgICAgICB2YXIgc1k6IG51bWJlciA9IE1hdGgubWluKGhlaWdodCAtIGR5LCB0aGlzLmhlaWdodCk7XG5cbiAgICAgICAgLy8gY29weSBwaXhlbHMgZnJvbSBweC9weSB0byB0aGUgYm91bmRzIHNldFxuICAgICAgICBmb3IgKHZhciBpWCA9IDA7IGlYIDwgc1g7IGlYKyspIHtcbiAgICAgICAgICAgIGZvciAodmFyIGlZID0gMDsgaVkgPCBzWTsgaVkrKykge1xuICAgICAgICAgICAgICAgIG5ld0FycmF5W2R4ICsgaVggKyAoZHkgKyBpWSkgKiB3aWR0aF0gPSB0aGlzLmFycltpWCArIGlZICogdGhpcy53aWR0aF07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmFyciA9IG5ld0FycmF5O1xuICAgICAgICB0aGlzLndpZHRoID0gd2lkdGg7XG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdlbmVyYXRlcyBhIGRyYXdhYmxlIGJpdG1hcCBmcm9tIHRoZSBkYXRhIGNvbnRhaW5lZCBpbiB0aGlzIG9iamVjdFxuICAgICAqIEBwYXJhbSBwYWxldHRlIFBhbGV0dGUgdG8gdXNlIHRvIHJlbmRlciBiaXRtYXBcbiAgICAgKiBAcmV0dXJucyBOZXcgYml0bWFwIGNyZWF0ZWQgZnJvbSBQYWxldHRlQnVmZmVyXG4gICAgICovXG4gICAgYXN5bmMgcmFzdGVyaXplKHBhbGV0dGU6IFBhbGV0dGUpOiBQcm9taXNlPEltYWdlQml0bWFwPiB7XG4gICAgICAgIC8vIENyZWF0ZSBpbWFnZSBkYXRhIG9mIHJpZ2h0IHNpemVcbiAgICAgICAgdmFyIGltYWdlRGF0YTogSW1hZ2VEYXRhID0gbmV3IEltYWdlRGF0YSh0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG4gICAgICAgIHZhciBkYXRCdWZmZXIgPSBuZXcgVWludDMyQXJyYXkoaW1hZ2VEYXRhLmRhdGEuYnVmZmVyKTtcblxuICAgICAgICAvLyBSZWFkIGluIHBhbGV0dGUgaW5mb3JtYXRpb24gdXNpbmcgaW5kaWNlcyBpbiB0aGUgYnVmZmVyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0QnVmZmVyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgcGl4ZWwgPSB0aGlzLmFycltpXTtcblxuICAgICAgICAgICAgaWYgKHBpeGVsID4gUGFsZXR0ZUluZGV4LlBBTEVUVEVfTEFTVCkge1xuICAgICAgICAgICAgICAgIC8vIGRvIG5vdCBhbGxvdyBkcmF3aW5nIGludmFsaWQgcGl4ZWxzXG4gICAgICAgICAgICAgICAgZGF0QnVmZmVyW2ldID0gcGFsZXR0ZS5jb2xvcnNbUGFsZXR0ZUluZGV4LlBBTEVUVEVfMF07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRhdEJ1ZmZlcltpXSA9IHBhbGV0dGUuY29sb3JzW3BpeGVsXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHJldHVybiBuZXcgYnVmZmVyXG4gICAgICAgIHJldHVybiBjcmVhdGVJbWFnZUJpdG1hcChpbWFnZURhdGEpO1xuICAgIH1cbn0iLCAiZXhwb3J0IGNsYXNzIFZlY3RvcjIge1xuICAgIHg6IG51bWJlcjtcbiAgICB5OiBudW1iZXI7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy54ID0gMDtcbiAgICAgICAgdGhpcy55ID0gMDtcbiAgICB9XG5cbiAgICBzdGF0aWMgY3JlYXRlKHg6IG51bWJlciwgeTogbnVtYmVyKTogVmVjdG9yMiB7XG4gICAgICAgIHZhciB2ZWMgPSBuZXcgVmVjdG9yMigpO1xuICAgICAgICB2ZWMueCA9IHg7XG4gICAgICAgIHZlYy55ID0geTtcbiAgICAgICAgcmV0dXJuIHZlYztcbiAgICB9XG5cbiAgICBhZGQodjogVmVjdG9yMikge1xuICAgICAgICB0aGlzLnggKz0gdi54O1xuICAgICAgICB0aGlzLnkgKz0gdi55O1xuICAgIH1cblxuICAgIHN1Yih2OiBWZWN0b3IyKSB7XG4gICAgICAgIHRoaXMueCArPSB2Lng7XG4gICAgICAgIHRoaXMueSArPSB2Lnk7XG4gICAgfVxuXG4gICAgbXVsKHY6IFZlY3RvcjIpIHtcbiAgICAgICAgdGhpcy54ICo9IHYueDtcbiAgICAgICAgdGhpcy55ICo9IHYueTtcbiAgICB9XG5cbiAgICBkaXYodjogVmVjdG9yMikge1xuICAgICAgICB0aGlzLnggLz0gdi54O1xuICAgICAgICB0aGlzLnkgLz0gdi55O1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFJlY3QgeyAgICBcbiAgICB0b3BMZWZ0OiBWZWN0b3IyO1xuICAgIGJ0bVJpZ2h0OiBWZWN0b3IyO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMudG9wTGVmdCA9IG5ldyBWZWN0b3IyKCk7XG4gICAgICAgIHRoaXMuYnRtUmlnaHQgPSBuZXcgVmVjdG9yMigpO1xuICAgIH1cblxuICAgIHN0YXRpYyBjcmVhdGUodG9wTGVmdDogVmVjdG9yMiwgYnRtUmlnaHQ6IFZlY3RvcjIpOiBSZWN0IHtcbiAgICAgICAgdmFyIHJlY3QgPSBuZXcgUmVjdCgpO1xuXG4gICAgICAgIHJlY3QudG9wTGVmdCA9IHRvcExlZnQ7XG4gICAgICAgIHJlY3QuYnRtUmlnaHQgPSBidG1SaWdodDtcblxuICAgICAgICByZXR1cm4gcmVjdDtcbiAgICB9XG59IiwgImltcG9ydCB7IFBhbGV0dGVJbmRleCB9IGZyb20gXCIuLi9QYWxldHRlXCI7XG5pbXBvcnQgeyBQaWN0b3B1cCB9IGZyb20gXCIuLi9QaWN0b3B1cFwiO1xuaW1wb3J0IHsgUGl4ZWxCdWZmZXIgfSBmcm9tIFwiLi4vUGl4ZWxCdWZmZXJcIjtcbmltcG9ydCB7IFJlY3QsIFZlY3RvcjIgfSBmcm9tIFwiLi4vR2VvbWV0cnlcIjtcbmltcG9ydCB7IEJhc2VUb29sIH0gZnJvbSBcIi4vQmFzZVRvb2xcIjtcblxuLyoqIEhvdyBtYW55IHBpeGVscyBpbiBhbnkgZGlyZWN0aW9uIHRvIHJlc2l6ZSB0aGUgcGl4ZWwgYnVmZmVyIHdoZW4gZHJhd2luZyB0byBhbiB1bmRlZmluZWQgcmVnaW9uIG9mIGl0ICovXG5jb25zdCBCVUZGRVJfUEFERElOR19TSVpFID0gNTA7XG5cbmV4cG9ydCBjbGFzcyBTdGFtcFRvb2wgaW1wbGVtZW50cyBCYXNlVG9vbCB7XG4gICAgbG9ja0lucHV0OiBib29sZWFuO1xuICAgIHBpY3RvOiBQaWN0b3B1cDtcblxuICAgIGN1cnJlbnRDb2xvcjogUGFsZXR0ZUluZGV4O1xuICAgIGN1cnJlbnRTY2FsZTogbnVtYmVyO1xuXG4gICAgcHJpdmF0ZSBzdGFtcD86IFBpeGVsQnVmZmVyO1xuICAgIHN0YW1wQ29weT86IFBpeGVsQnVmZmVyO1xuXG4gICAgLyoqIFdvcmsgYnVmZmVyLCBjb3B5IG9mIHBpY3RvJ3Mgc2l6ZSAqL1xuICAgIHdvcmtCdWZmZXI/OiBQaXhlbEJ1ZmZlcjtcbiAgICAvKiogVG9wIGxlZnQgb2Ygd29yayBidWZmZXIgaW4gY2FudmFzIHNwYWNlICovXG4gICAgd29ya0J1ZmZlckNvb3JkaW5hdGVzPzogVmVjdG9yMjtcbiAgICAvKiogVHJ1ZSByZWN0IG9mIHdvcmsgYnVmZmVyIGNvbnRlbnRzICovXG4gICAgd29ya0J1ZmZlclJlY3Q/OiBSZWN0O1xuXG4gICAgY29uc3RydWN0b3IocGljdG86IFBpY3RvcHVwKSB7XG4gICAgICAgIHRoaXMubG9ja0lucHV0ID0gZmFsc2U7XG4gICAgICAgIHRoaXMucGljdG8gPSBwaWN0bztcblxuICAgICAgICB0aGlzLmN1cnJlbnRDb2xvciA9IFBhbGV0dGVJbmRleC5QQUxFVFRFXzE7IC8vIGZpcnN0IG5vbi1iYWNrZ3JvdW5kIGNvbG9yXG4gICAgICAgIHRoaXMuY3VycmVudFNjYWxlID0gMTtcbiAgICB9XG5cbiAgICAvKiogXG4gICAgICogQ3JlYXRlcyBhIG5ldyB3b3JrIGJ1ZmZlciB0byBkcmF3IGNoYW5nZXMgdG9cbiAgICAgKi9cbiAgICBwcml2YXRlIGNyZWF0ZU5ld1dvcmtCdWZmZXIoKSB7XG4gICAgICAgIHRoaXMud29ya0J1ZmZlciA9IG5ldyBQaXhlbEJ1ZmZlcihCVUZGRVJfUEFERElOR19TSVpFLCBCVUZGRVJfUEFERElOR19TSVpFKTtcbiAgICAgICAgdGhpcy53b3JrQnVmZmVyLmFyci5maWxsKFBhbGV0dGVJbmRleC5QQUxFVFRFX01BU0spO1xuXG4gICAgICAgIC8vIENsZWFyIGV4aXN0aW5nIHdvcmsgY29vcmRpbmF0ZXMgXG4gICAgICAgIGRlbGV0ZSB0aGlzLndvcmtCdWZmZXJDb29yZGluYXRlcztcbiAgICAgICAgZGVsZXRlIHRoaXMud29ya0J1ZmZlclJlY3Q7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVzaXplcyB0aGUgd29yayBidWZmZXIgdG8gaGF2ZSBlbm91Z2ggcm9vbSB0byBibGl0IHRoZSByZXF1ZXN0ZWQgcmVjdFxuICAgICAqIEBwYXJhbSByZWN0IE5ldyByZWN0IGJlaW5nIGJsaXQgaW4gY2FudmFzLXNwYWNlIGNvb3JkaW5hdGVzXG4gICAgICovXG4gICAgcHJpdmF0ZSByZXNpemVXb3JrQnVmZmVyKHJlY3Q6IFJlY3QpIHtcbiAgICAgICAgaWYgKHRoaXMud29ya0J1ZmZlciA9PSB1bmRlZmluZWQpIHJldHVybjtcblxuICAgICAgICAvLyBBdXRvLWFzc2lnbiB0b3AgbGVmdCBjb29yZGluYXRlIGlmIHBvc3NpYmxlXG4gICAgICAgIGlmICh0aGlzLndvcmtCdWZmZXJDb29yZGluYXRlcyA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMud29ya0J1ZmZlckNvb3JkaW5hdGVzID0gcmVjdC50b3BMZWZ0O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMud29ya0J1ZmZlclJlY3QgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLndvcmtCdWZmZXJSZWN0ID0gcmVjdDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIERldGVybWluZSBhY3R1YWwgYnVmZmVyIHJlY3RcbiAgICAgICAgICAgIHRoaXMud29ya0J1ZmZlclJlY3QudG9wTGVmdC54ID0gTWF0aC5taW4odGhpcy53b3JrQnVmZmVyUmVjdC50b3BMZWZ0LngsIHJlY3QudG9wTGVmdC54KTtcbiAgICAgICAgICAgIHRoaXMud29ya0J1ZmZlclJlY3QudG9wTGVmdC55ID0gTWF0aC5taW4odGhpcy53b3JrQnVmZmVyUmVjdC50b3BMZWZ0LnksIHJlY3QudG9wTGVmdC55KTtcbiAgICAgICAgICAgIHRoaXMud29ya0J1ZmZlclJlY3QuYnRtUmlnaHQueCA9IE1hdGgubWF4KHRoaXMud29ya0J1ZmZlclJlY3QuYnRtUmlnaHQueCwgcmVjdC5idG1SaWdodC54KTtcbiAgICAgICAgICAgIHRoaXMud29ya0J1ZmZlclJlY3QuYnRtUmlnaHQueSA9IE1hdGgubWF4KHRoaXMud29ya0J1ZmZlclJlY3QuYnRtUmlnaHQueSwgcmVjdC5idG1SaWdodC55KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBsZWZ0U2NhbGUgPSAwOyAvLyBkb3VibGVzIGFzIG5ldyBYIG9mZnNldCBvZiByZXNpemVcbiAgICAgICAgdmFyIHJpZ2h0U2NhbGUgPSAwO1xuICAgICAgICB2YXIgdXBTY2FsZSA9IDA7IC8vIGRvdWJsZXMgYXMgbmV3IFkgb2Zmc2V0IG9mIHJlc2l6ZVxuICAgICAgICB2YXIgZG5TY2FsZSA9IDA7XG5cbiAgICAgICAgLy8gRGV0ZXJtaW5lIGxlZnQgc2NhbGVcbiAgICAgICAgaWYgKHJlY3QudG9wTGVmdC54IDwgdGhpcy53b3JrQnVmZmVyQ29vcmRpbmF0ZXMueCkge1xuICAgICAgICAgICAgbGVmdFNjYWxlID0gTWF0aC5tYXgoQlVGRkVSX1BBRERJTkdfU0laRSwgdGhpcy53b3JrQnVmZmVyQ29vcmRpbmF0ZXMueCAtIHJlY3QudG9wTGVmdC54KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVjdC5idG1SaWdodC54ID49IHRoaXMud29ya0J1ZmZlckNvb3JkaW5hdGVzLnggKyB0aGlzLndvcmtCdWZmZXIud2lkdGgpIHtcbiAgICAgICAgICAgIHJpZ2h0U2NhbGUgPSBNYXRoLm1heChCVUZGRVJfUEFERElOR19TSVpFLCByZWN0LmJ0bVJpZ2h0LnggLSAodGhpcy53b3JrQnVmZmVyQ29vcmRpbmF0ZXMueCArIHRoaXMud29ya0J1ZmZlci53aWR0aCkpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZWN0LnRvcExlZnQueSA8IHRoaXMud29ya0J1ZmZlckNvb3JkaW5hdGVzLnkpIHtcbiAgICAgICAgICAgIHVwU2NhbGUgPSBNYXRoLm1heChCVUZGRVJfUEFERElOR19TSVpFLCB0aGlzLndvcmtCdWZmZXJDb29yZGluYXRlcy55IC0gcmVjdC50b3BMZWZ0LnkpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZWN0LmJ0bVJpZ2h0LnkgPj0gdGhpcy53b3JrQnVmZmVyQ29vcmRpbmF0ZXMueSArIHRoaXMud29ya0J1ZmZlci5oZWlnaHQpIHtcbiAgICAgICAgICAgIGRuU2NhbGUgPSBNYXRoLm1heChCVUZGRVJfUEFERElOR19TSVpFLCByZWN0LmJ0bVJpZ2h0LnkgLSAodGhpcy53b3JrQnVmZmVyQ29vcmRpbmF0ZXMueSArIHRoaXMud29ya0J1ZmZlci5oZWlnaHQpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE5vIHNjYWxpbmcgbmVlZHMgdG8gYmUgZG9uZSAhXG4gICAgICAgIGlmIChsZWZ0U2NhbGUgKyByaWdodFNjYWxlICsgdXBTY2FsZSArIGRuU2NhbGUgPT0gMCkgcmV0dXJuO1xuXG4gICAgICAgIC8vIFJlc2l6ZSBhY2NvcmRpbmcgdG8gc2NhbGluZyBpbiBkaXJlY3Rpb25zXG4gICAgICAgIHRoaXMud29ya0J1ZmZlcj8uc2NhbGUobGVmdFNjYWxlLCB1cFNjYWxlLCB0aGlzLndvcmtCdWZmZXIud2lkdGggKyBsZWZ0U2NhbGUgKyByaWdodFNjYWxlLCB0aGlzLndvcmtCdWZmZXIuaGVpZ2h0ICsgdXBTY2FsZSArIGRuU2NhbGUpO1xuXG4gICAgICAgIC8vIE1vdmUgdG9wIGxlZnQgb2YgYnVmZmVyIHRvIG5ldyBjb29yZGluYXRlcyBwcm92aWRlZCBieSB0aGUgcmVzaXplXG4gICAgICAgIHRoaXMud29ya0J1ZmZlckNvb3JkaW5hdGVzLnN1YihWZWN0b3IyLmNyZWF0ZShsZWZ0U2NhbGUsIHVwU2NhbGUpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBCbGl0cyB0aGUgY3VycmVudCBicnVzaCB0byB0aGUgd29yayBidWZmZXIgY3VycmVudGx5IGluIHVzZVxuICAgICAqIEBwYXJhbSBweCBDZW50ZXIgWCBjb29yZGluYXRlXG4gICAgICogQHBhcmFtIHB5IENlbnRlciBZIGNvb3JkaW5hdGVcbiAgICAgKi9cbiAgICBwdWJsaWMgd3JpdGVTdGFtcFRvV29ya0J1ZmZlcihweDogbnVtYmVyLCBweTogbnVtYmVyKSB7XG4gICAgICAgIC8vIERvIG5vdCBhbGxvdyB3cml0aW5nIGVtcHR5IHN0YW1wc1xuICAgICAgICBpZiAodGhpcy5zdGFtcENvcHkgPT0gdW5kZWZpbmVkKSByZXR1cm47XG5cbiAgICAgICAgLy8gQ2FsY3VsYXRlIGNhbnZhcy1zcGFjZSBjb29yZGluYXRlcyBmb3IgdGhlIGJvdW5kaW5nIHJlY3Qgb2YgdGhlIHN0YW1wXG4gICAgICAgIHZhciByZWN0ID0gUmVjdC5jcmVhdGUoXG4gICAgICAgICAgICBWZWN0b3IyLmNyZWF0ZShweCAtIE1hdGguZmxvb3IodGhpcy5jdXJyZW50U2NhbGUgLyAyKSwgcHkgLSBNYXRoLmZsb29yKHRoaXMuY3VycmVudFNjYWxlIC8gMikpLFxuICAgICAgICAgICAgVmVjdG9yMi5jcmVhdGUocHggKyBNYXRoLmNlaWwodGhpcy5jdXJyZW50U2NhbGUgLyAyKSwgcHkgKyBNYXRoLmNlaWwodGhpcy5jdXJyZW50U2NhbGUgLyAyKSlcbiAgICAgICAgKTtcblxuICAgICAgICAvLyBDcmVhdGUgYnVmZmVyIGlmIG5lY2Vzc2FyeVxuICAgICAgICBpZiAodGhpcy53b3JrQnVmZmVyID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVOZXdXb3JrQnVmZmVyKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZXNpemUgdGhlIGJ1ZmZlciBhY2NvcmRpbmdseVxuICAgICAgICB0aGlzLnJlc2l6ZVdvcmtCdWZmZXIocmVjdCk7XG5cbiAgICAgICAgLy8gQmxpdCBjb250ZW50cyBvZiB0aGUgc3RhbXAgdG8gdGhlIHdvcmsgYnVmZmVyXG4gICAgICAgIHZhciB4Q29vcmQgPSByZWN0LnRvcExlZnQueCAtIHRoaXMud29ya0J1ZmZlckNvb3JkaW5hdGVzIS54O1xuICAgICAgICB2YXIgeUNvb3JkID0gcmVjdC50b3BMZWZ0LnkgLSB0aGlzLndvcmtCdWZmZXJDb29yZGluYXRlcyEueTtcblxuICAgICAgICB0aGlzLndvcmtCdWZmZXIhLmJsaXQodGhpcy5zdGFtcENvcHksIHhDb29yZCwgeUNvb3JkLCAwLCAwLCB0aGlzLnN0YW1wQ29weS53aWR0aCwgdGhpcy5zdGFtcENvcHkuaGVpZ2h0KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBXcml0ZXMgdGhlIHdvcmsgYnVmZmVyIHRvIHRoZSBQaWN0b3B1cCBpbnN0YW5jZVxuICAgICAqL1xuICAgIHB1YmxpYyBjb21taXRXb3JrQnVmZmVyKCkge1xuICAgICAgICBpZiAodGhpcy53b3JrQnVmZmVyID09IHVuZGVmaW5lZCkgcmV0dXJuO1xuXG4gICAgICAgIC8vIExldCdzIGNhbGN1bGF0ZSBob3cgbXVjaCBzcGFjZSBpcyBhY3R1YWxseSBuZWVkZWQgdG8gYmUgd3JpdHRlblxuXG4gICAgICAgIC8vIFRPRE86IENyZWF0ZSBjYW52YXMgYWN0aW9uLCBwcm9wZXJseSB3cml0ZSBvdXQuXG4gICAgICAgIC8vIFdlIGFyZSBqdXN0IGdvaW5nIHRvIGNvcHkgd2hhdCB3ZSBjYW4gcmlnaHQgbm93XG4gICAgICAgIHRoaXMucGljdG8uaW1hZ2VCdWZmZXIuYmxpdChcbiAgICAgICAgICAgIHRoaXMud29ya0J1ZmZlciEsXG4gICAgICAgICAgICB0aGlzLndvcmtCdWZmZXJDb29yZGluYXRlcyEueCxcbiAgICAgICAgICAgIHRoaXMud29ya0J1ZmZlckNvb3JkaW5hdGVzIS55LFxuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICB0aGlzLndvcmtCdWZmZXIhLndpZHRoLFxuICAgICAgICAgICAgdGhpcy53b3JrQnVmZmVyIS5oZWlnaHQpO1xuXG4gICAgICAgIC8vIEVyYXNlIGN1cnJlbnQgd29yayBidWZmZXJcbiAgICAgICAgZGVsZXRlIHRoaXMud29ya0J1ZmZlcjtcbiAgICAgICAgZGVsZXRlIHRoaXMud29ya0J1ZmZlckNvb3JkaW5hdGVzO1xuICAgICAgICBkZWxldGUgdGhpcy53b3JrQnVmZmVyUmVjdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBMb2FkcyBhbiBpbWFnZSBpbnRvIHRoZSBtYXN0ZXIgc3RhbXAgc2xvdCBhcyB3ZWxsIGFzIGl0cyB0cmFuc2Zvcm1lZCBjb3B5XG4gICAgICogQW55IGJsYWNrIHBpeGVscyBhcmUgaW50ZXJwcmV0ZWQgYXMgXG4gICAgICogQHBhcmFtIGltYWdlIEltYWdlIHRvIHVzZSBhcyB0aGUgc3RhbXBcbiAgICAgKi9cbiAgICBsb2FkU3RhbXBGcm9tSW1hZ2VEYXRhKGltYWdlOiBJbWFnZURhdGEpIHtcbiAgICAgICAgdmFyIHBpeGVsQXJyYXk6IFVpbnQzMkFycmF5ID0gbmV3IFVpbnQzMkFycmF5KGltYWdlLmRhdGEuYnVmZmVyKTtcblxuICAgICAgICB0aGlzLnN0YW1wID0gbmV3IFBpeGVsQnVmZmVyKGltYWdlLndpZHRoLCBpbWFnZS5oZWlnaHQpO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGl4ZWxBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5zdGFtcC5hcnJbaV0gPSAoKHBpeGVsQXJyYXlbaV0gJiAweEZGMDAwMDAwKSA9PSAwKSA/IFBhbGV0dGVJbmRleC5QQUxFVFRFX01BU0sgOiB0aGlzLmN1cnJlbnRDb2xvcjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc3RhbXBDb3B5ID0gdGhpcy5zdGFtcC5jbG9uZSgpO1xuICAgICAgICB0aGlzLnNldFNjYWxlKHRoaXMuY3VycmVudFNjYWxlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSBwaXhlbCBjb2xvciBvZiB0aGUgc3RhbXAgY29weVxuICAgICAqIEBwYXJhbSBjb2xvciBQYWxldHRlIGNvbG9yIHRvIHVzZVxuICAgICAqL1xuICAgIHNldENvbG9yKGNvbG9yOiBQYWxldHRlSW5kZXgpIHtcbiAgICAgICAgaWYgKHRoaXMuc3RhbXBDb3B5ICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnN0YW1wQ29weS5hcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zdGFtcENvcHkuYXJyW2ldICE9IFBhbGV0dGVJbmRleC5QQUxFVFRFX01BU0spIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGFtcENvcHkuYXJyW2ldID0gY29sb3I7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jdXJyZW50Q29sb3IgPSBjb2xvcjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTY2FsZXMgdGhlIGRlc2lyZWQgb3V0cHV0IHN0YW1wIHRvIGEgbmV3IHNpemVcbiAgICAgKiBAcGFyYW0gc2NhbGUgSGVpZ2h0IGluIHBpeGVsc1xuICAgICAqL1xuICAgIHNldFNjYWxlKHNjYWxlOiBudW1iZXIpIHtcbiAgICAgICAgaWYgKHRoaXMuc3RhbXAgIT0gdW5kZWZpbmVkKSB7XG5cbiAgICAgICAgICAgIHZhciBuZXdXaWR0aDogbnVtYmVyID0gTWF0aC5mbG9vcigodGhpcy5zdGFtcC53aWR0aCAvIHRoaXMuc3RhbXAuaGVpZ2h0KSAqIHNjYWxlKTtcbiAgICAgICAgICAgIHZhciBuZXdIZWlnaHQ6IG51bWJlciA9IHNjYWxlO1xuXG4gICAgICAgICAgICB2YXIgclcgPSB0aGlzLnN0YW1wLndpZHRoIC8gbmV3V2lkdGg7XG4gICAgICAgICAgICB2YXIgckggPSB0aGlzLnN0YW1wLmhlaWdodCAvIG5ld0hlaWdodDtcblxuICAgICAgICAgICAgZGVsZXRlIHRoaXMuc3RhbXBDb3B5O1xuICAgICAgICAgICAgdGhpcy5zdGFtcENvcHkgPSBuZXcgUGl4ZWxCdWZmZXIobmV3V2lkdGgsIG5ld0hlaWdodCk7XG4gICAgICAgICAgICB0aGlzLnN0YW1wQ29weS5hcnIuZmlsbChQYWxldHRlSW5kZXguUEFMRVRURV9NQVNLLCAwLCB0aGlzLnN0YW1wQ29weS5hcnIubGVuZ3RoKTtcblxuICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBuZXdXaWR0aDsgeCsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNYID0gTWF0aC5mbG9vcihyVyAqIHgpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIHkgPSAwOyB5IDwgbmV3SGVpZ2h0OyB5KyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNZID0gTWF0aC5mbG9vcihySCAqIHkpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0YW1wLmFycltzWCArIHNZICogdGhpcy5zdGFtcC53aWR0aF0gIT0gUGFsZXR0ZUluZGV4LlBBTEVUVEVfTUFTSykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGFtcENvcHkuYXJyW3ggKyB5ICogbmV3V2lkdGhdID0gdGhpcy5jdXJyZW50Q29sb3I7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmN1cnJlbnRTY2FsZSA9IHNjYWxlO1xuICAgIH1cblxuICAgIHByb2Nlc3NJbnB1dEV2ZW50KGV2ZW50OiBJbnB1dEV2ZW50KTogdm9pZCB7XG5cbiAgICB9XG59Il0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7OztBQ3NCTyxNQUFNLFVBQU4sTUFBYztBQUFBO0FBQUE7QUFBQTtBQUFBLElBT2pCLGNBQWM7QUFMZDtBQUFBO0FBTUksV0FBSyxTQUFTLElBQUksWUFBWTtBQUFBLFFBQzFCO0FBQUE7QUFBQSxRQUNBO0FBQUE7QUFBQSxRQUNBO0FBQUE7QUFBQSxRQUNBO0FBQUE7QUFBQSxRQUNBO0FBQUE7QUFBQSxRQUNBO0FBQUE7QUFBQSxRQUNBO0FBQUE7QUFBQSxRQUNBO0FBQUE7QUFBQSxRQUNBO0FBQUE7QUFBQSxRQUNBO0FBQUE7QUFBQSxRQUNBO0FBQUE7QUFBQSxRQUNBO0FBQUE7QUFBQSxRQUNBO0FBQUE7QUFBQSxRQUNBO0FBQUE7QUFBQSxRQUNBO0FBQUE7QUFBQSxRQUNBO0FBQUE7QUFBQSxNQUNKLENBQUM7QUFBQSxJQUNMO0FBQUEsRUFDSjs7O0FDNUNPLE1BQU0sY0FBTixNQUFNLGFBQVk7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFhckIsWUFBWSxJQUFZLElBQVk7QUFYcEM7QUFBQTtBQUVBO0FBQUE7QUFFQTtBQUFBO0FBUUksV0FBSyxNQUFNLElBQUksVUFBVSxLQUFLLEVBQUU7QUFDaEMsV0FBSyxRQUFRO0FBQ2IsV0FB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
