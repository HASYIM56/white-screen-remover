$(document).ready(function () {
    $('#removeBgForm').on('submit', function (e) {
        e.preventDefault();

        const fileInput = $('input[type="file"]')[0].files[0];

        if (!fileInput) {
            alert("Please select an image file.");
            return;
        }

        $('#loadingContainer').show();
        $('#loadingBar').css('width', '0%');
        $('#loadingText').text('0%');

        const reader = new FileReader();
        reader.onload = function (event) {
            const imageData = event.target.result;

            // Simulate Python code for white screen removal
            function removeWhiteScreen(dataUrl) {
                return new Promise((resolve) => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    const img = new Image();

                    img.onload = () => {
                        canvas.width = img.width;
                        canvas.height = img.height;
                        ctx.drawImage(img, 0, 0);

                        const imageData = ctx.getImageData(0, 0, img.width, img.height);
                        const data = imageData.data;

                        for (let i = 0; i < data.length; i += 4) {
                            const r = data[i];
                            const g = data[i + 1];
                            const b = data[i + 2];

                            // White color range to remove
                            if (r >= 200 && r <= 255 && g >= 200 && g <= 255 && b >= 200 && b <= 255) {
                                data[i + 3] = 0; // Make transparent
                            }
                        }

                        ctx.putImageData(imageData, 0, 0);
                        resolve(canvas.toDataURL("image/png"));
                    };

                    img.src = dataUrl;
                });
            }

            removeWhiteScreen(imageData).then((resultImage) => {
                $('#loadingContainer').hide();
                $('#statusMessage').text("White screen removed successfully.");
                $('#resultContainer').show();

                $('#resultImage').attr('src', resultImage);

                $('#downloadButton').click(function () {
                    const link = document.createElement('a');
                    link.href = resultImage;
                    link.download = "white_screen_removed_H56.png";
                    link.click();
                });
            });
        };

        reader.onprogress = function (data) {
            if (data.lengthComputable) {
                const progress = Math.round((data.loaded / data.total) * 100);
                $('#loadingBar').css('width', progress + '%');
                $('#loadingText').text(progress + '%');
            }
        };

        reader.readAsDataURL(fileInput);
    });
});