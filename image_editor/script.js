const defaultFilters = {
            brightness: { value: 100, min: 0, max: 200, unit: '%' },
            contrast: { value: 100, min: 0, max: 200, unit: '%' },
            saturation: { value: 100, min: 0, max: 200, unit: '%' },
            exposure: { value: 100, min: 0, max: 200, unit: '%' }, 
            hueRotate: { value: 0, min: 0, max: 360, unit: 'deg' },
            blur: { value: 0, min: 0, max: 20, unit: 'px' },
            sepia: { value: 0, min: 0, max: 100, unit: '%' },
            grayscale: { value: 0, min: 0, max: 100, unit: '%' },
            opacity: { value: 100, min: 0, max: 100, unit: '%' },
            invert: { value: 0, min: 0, max: 100, unit: '%' },
        };

        let filters = JSON.parse(JSON.stringify(defaultFilters));

        // --- Elements ---
        const filterContainer = document.querySelector(".filtersContainer");
        const imageCanvas = document.querySelector("#image-canvas");
        const imageInput = document.querySelector("#image-input");
        const resetBtn = document.querySelector("#reset-btn");
        const downloadBtn = document.querySelector("#download-btn");
        const placeholderText = document.querySelector("#placeholder-text");
        const ctx = imageCanvas.getContext("2d");

        let originalImage = null;

        // --- Initialization ---
        function init() {
            renderFilterControls();
            setupPresets();
        }

        // --- Create Controls ---
        function createFilterElement(key, config) {
            const container = document.createElement("div");
            
            const header = document.createElement("div");
            header.classList.add("flex", "justify-between", "mb-2");

            const label = document.createElement("label");
            label.classList.add("text-xs", "text-gray-400", "font-medium", "capitalize");

            label.innerText = key.replace(/([A-Z])/g, ' $1').trim();

            const valueSpan = document.createElement("span");
            valueSpan.classList.add("text-xs", "text-gray-500", "font-mono");
            valueSpan.id = `val-${key}`;
            valueSpan.innerText = config.value + config.unit;

            header.append(label, valueSpan);

            const input = document.createElement("input");
            input.type = "range";
            input.classList.add("w-full");
            input.min = config.min;
            input.max = config.max;
            input.value = config.value;
            input.id = key;

            input.addEventListener("input", (e) => {
                const newValue = e.target.value;
                filters[key].value = newValue;
                valueSpan.innerText = newValue + config.unit;
                applyFilters();
            });

            container.append(header, input);
            return container;
        }

        function renderFilterControls() {
            filterContainer.innerHTML = "";
            Object.keys(filters).forEach(key => {
                const element = createFilterElement(key, filters[key]);
                filterContainer.appendChild(element);
            });
        }

        // --- Image Handling ---
        imageInput.addEventListener("change", (event) => {
            const file = event.target.files[0]; 
            if (!file) return;

            const img = new Image();
            img.src = URL.createObjectURL(file);
            
            img.onload = () => {
                originalImage = img;

                imageCanvas.width = img.width;
                imageCanvas.height = img.height;
                
                placeholderText.style.display = 'none';

                applyFilters(); 
            };
        });

        function applyFilters() {
            if (!originalImage) return;


            const exposureMult = filters.exposure.value / 100;
            const brightnessTotal = (filters.brightness.value * exposureMult);

            const filterString = `
                brightness(${brightnessTotal}%)
                contrast(${filters.contrast.value}%)
                saturate(${filters.saturation.value}%)
                hue-rotate(${filters.hueRotate.value}deg)
                blur(${filters.blur.value}px)
                sepia(${filters.sepia.value}%)
                grayscale(${filters.grayscale.value}%)
                opacity(${filters.opacity.value}%)
                invert(${filters.invert.value}%)
            `;
            ctx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
            ctx.filter = filterString;
            ctx.drawImage(originalImage, 0, 0, imageCanvas.width, imageCanvas.height);
        }

        function updateUIValues() {
            Object.keys(filters).forEach(key => {
                const input = document.getElementById(key);
                const span = document.getElementById(`val-${key}`);
                if(input && span) {
                    input.value = filters[key].value;
                    span.innerText = filters[key].value + filters[key].unit;
                }
            });
            applyFilters();
        }

        resetBtn.addEventListener("click", () => {
            filters = JSON.parse(JSON.stringify(defaultFilters));
            updateUIValues();
        });

        function setupPresets() {
            const buttons = document.querySelectorAll(".preset-btn");
            buttons.forEach(btn => {
                btn.addEventListener("click", () => {
                    filters = JSON.parse(JSON.stringify(defaultFilters));
                    
                    const type = btn.dataset.preset;
                    
                    switch(type) {
                        case 'vintage':
                            filters.sepia.value = 40;
                            filters.contrast.value = 120;
                            filters.brightness.value = 90;
                            break;
                        case 'cold':
                            filters.hueRotate.value = 180;
                            filters.saturation.value = 80;
                            filters.brightness.value = 110;
                            break;
                        case 'warm':
                            filters.sepia.value = 20;
                            filters.hueRotate.value = -10;
                            filters.saturation.value = 130;
                            break;
                        case 'dramatic':
                            filters.contrast.value = 150;
                            filters.grayscale.value = 80;
                            break;
                        case 'bw':
                            filters.grayscale.value = 100;
                            filters.contrast.value = 120;
                            break;
                    }
                    updateUIValues();
                });
            });
        }

        // --- Download ---
        downloadBtn.addEventListener("click", () => {
            if(!originalImage) return alert("Please upload an image first!");
            
            const link = document.createElement("a");
            link.download = "edited-image.png";
            link.href = imageCanvas.toDataURL();
            link.click();
        });

        init();