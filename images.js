// -----------------------------------
// PPOverlay - abstraction for overlay
// -----------------------------------
var PPOverlay = function () {
    this.Id;
    this.Url = null;
    this.Width = 0;
    this.Height = 0;

    // Position
    this.X = 50;
    this.Y = 50;
    this.Opacity = 0.5;
}

// --------------------------------------------------------------------
// PPStogare - place where images are stored permanently. Static object
// --------------------------------------------------------------------
var PPStorage = new function () {

    // -------------------------------
    // Get all PPOverlays from storage
    // -------------------------------
    this.GetOverlays = function () {
        var overlaysCount = this._getOverlaysCount();
        var overlays = [];
        for (var i = 0; i < overlaysCount; i++) {
            overlays[i] = this.GetOverlay(i);
        }
        return overlays;
    }

    // -------------------------------
    // Get PPOverlay object from storage
    // -------------------------------
    this.GetOverlay = function (id) {
        var overlayDataAsStr = localStorage["overlay" + id + "_data"];
        var overlayPositionAsStr = localStorage["overlay" + id + "_position"];
        if (overlayDataAsStr == null || overlayPositionAsStr == null)
            return null;
        var overlayData = JSON.parse(overlayDataAsStr);
        var overlayPosition = JSON.parse(overlayPositionAsStr);

        var overlay = new PPOverlay();
        overlay.Id = overlayData.Id;
        overlay.Width = overlayData.Width;
        overlay.Height = overlayData.Height;
        overlay.Url = overlayData.Url;
        overlay.X = overlayPosition.X;
        overlay.Y = overlayPosition.Y;
        overlay.Opacity = overlayPosition.Opacity;

        return overlay;
    };

    // ----------------------------------
    // Save PPOverlay object into storage
    // ----------------------------------
    this.SaveOverlay = function (overlay) {
        if (!(overlay instanceof PPOverlay))
            alert("Object of type PPOverlay should be provided");

        if (!overlay.Id) {
            // New overlay
            overlay.Id = 0;//TODO delete
            //overlay.Id = this._getOverlaysCount();//TODO uncomment
        }

        var overlayData = { Id: overlay.Id, Url: overlay.Url, Height: overlay.Height, Width: overlay.Width };
        var overlayPosition = { X: overlay.X, Y: overlay.Y, Opacity: overlay.Opacity };
        localStorage["overlay" + overlay.Id + "_data"] = JSON.stringify(overlayData);
        localStorage["overlay" + overlay.Id + "_position"] = JSON.stringify(overlayPosition);
    };

    this.UpdateOverlayPosition = function (overlayId, newPosition) {
        localStorage["overlay" + overlayId + "_position"] = JSON.stringify(newPosition);
    }

    // ---------------------------------------------------
    // Create PPOverlay from file and save it into storage
    // ---------------------------------------------------
    this.SaveOverlayFromFile = function (file, callback) {
        // Only process image files.
        if (!file.type.match('image.*')) {
            alert('File must contain image');
        }

        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = (function (theFile) {
            return function (e) {
                var overlay = new PPOverlay();
                overlay.Url = e.target.result;

                // Render invisible thumbnail to obtain image width and height.
                var span = $('<span></span>').css('position', 'absolute').css('opacity', 0);
                var img = $('<img />').attr({
                    src: e.target.result,
                    title: theFile.name
                });
                span.append(img);
                $(document.body).append(span);

                img.load(function () {
                    overlay.Width = img[0].offsetWidth;
                    overlay.Height = img[0].offsetHeight;

                    PPStorage.SaveOverlay(overlay);

                    span.remove();
                    callback();
                });
            };
        })(file);

        // Read in the image file as a data URL.
        reader.readAsDataURL(file);
    };

    // -- Private members --
    this._getOverlaysCount = function () {
        var count = 0;
        while (localStorage["overlay" + count + "_data"]) {
            count++;
        }
        return count;
    }

};
//            var getBase64Image = function (img) {
//                // Create an empty canvas element
//                var canvas = document.createElement("canvas");
//                canvas.width = img.width;
//                canvas.height = img.height;

//                // Copy the image contents to the canvas
//                var ctx = canvas.getContext("2d");
//                ctx.drawImage(img, 0, 0);

//                // Get the data-URL formatted image
//                // Firefox supports PNG and JPEG. You could check img.src to
//                // guess the original format, but be aware the using "image/jpg"
//                // will re-encode the image.
//                var dataURL = canvas.toDataURL("image/jpg");

//                return dataURL;
//            }
