/**
 * Function to toggle the visibility for each 3D model, put it on the first available arrowshaft and change the style of the corresponding menu icon.
 */
document.addEventListener("DOMContentLoaded", function () {
    const option_icon_ids = ["raschiatoio271435", "arrowhead271422"]; //, "arrowhead271409", "lama_pugnaletto", "arrowhead271407","lama271379"
    const visibility_states = option_icon_ids.map(() => false);
    const baseShift = {};
    const originalPositions = {};

    // Wait for the A-Frame scene to load and then get original position and init shift from origin for each 3D model.
    const scene = document.querySelector('a-scene');
    scene.addEventListener('loaded', () => {
        option_icon_ids.forEach((id) => {
            const entity = document.querySelector(`.${id}-entity`);
            if (entity) {
                originalPositions[id] = entity.getAttribute("position");
                baseShift[id] = -entity.getAttribute("position").x;
            }
        });
    });

    /**
     *  Set the visibility of a 3D model shifting it to the correct position and update the menu icon style.
     * @param {*} button 
     * @param {*} entities list of a-entity with visibility to be toggled
     * @param {boolean} visible state of visibility to be set
     * @param {string} id identifier for the entity
     */
    const setVisible = (button, entities, visible, id) => {
        const num_visibles = visibility_states.filter(state => state == true).length - 1;
        entities.forEach(entity => {

            if (originalPositions[id]) {
                const shift = baseShift[id] * num_visibles;
                
                console.log("\n\nNUM VIS: ", num_visibles);
                console.log("SHIFT: ", shift);
                console.log("VISIBLE: ", visible);
                console.log("original pos: ", originalPositions[id]);

                if (visible) {
                    entity.setAttribute("position", {
                        x: originalPositions[id].x + shift,
                        y: originalPositions[id].y,
                        z: originalPositions[id].z
                    });
                    console.log("X shift: ", originalPositions[id].x + shift);
                } else {
                    entity.setAttribute("position", {
                        x: originalPositions[id].x - shift,
                        y: originalPositions[id].y,
                        z: originalPositions[id].z
                    });
                    console.log("X shift: ", originalPositions[id].x - shift);
                }
            }
            entity.setAttribute("visible", visible);


        });
        button.classList.toggle("selected", visible);

    };


    option_icon_ids.forEach((id, index) => {
        const button = document.querySelector(`#${id}`);
        const entities = document.querySelectorAll(`.${id}-entity`);
        // Set initial visibility.
        setVisible(button, entities, visibility_states[index]);
        // Add a click event listener to toggle visibility of the 3D model on click
        button.addEventListener('click', () => {
            visibility_states[index] = !visibility_states[index];
            setVisible(button, entities, visibility_states[index], id);
        });
    });
});
