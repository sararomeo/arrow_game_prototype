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
        // Set the original positions after the scene has loaded
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
        entities.forEach(entity => {
            num_visibles = visibility_states.filter(state => state == true).length - 1;

            const newX = originalPositions[option_icon_ids[index]] + num_visibles * baseShift[option_icon_ids[index]];
            console.log(newX);
/*
            const currentPosition = entity.getAttribute("position");
            console.log("NO INIT POS???????", currentPosition);
            console.log("baseshift*num_vis: ", shiftAmount * num_visibles, "shift ", shiftAmount, "num visi before shift ", num_visibles)
            if (visible) {
                entity.setAttribute("position", {
                    x: parseFloat(shiftAmount * num_visibles)-0.5,
                    y: currentPosition.y,
                    z: currentPosition.z
                });
            } else {
                entity.setAttribute("position", {
                    x: parseFloat(shiftAmount * num_visibles),
                    y: currentPosition.y,
                    z: currentPosition.z
                });
            }*/

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
