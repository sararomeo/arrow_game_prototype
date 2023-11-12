document.addEventListener("DOMContentLoaded", function () {
    const option_icon_ids = ["raschiatoio271435", "arrowhead271422"]; //, "arrowhead271409", "lama_pugnaletto", "arrowhead271407","lama271379"
    const visibility_states = option_icon_ids.map(() => false);
    const baseShift = {};
    const originalPositions = {};
    const arrowshaftOccupied = [false, false, false];

    // Functions to keep track of arrow shaft occupation.
    const occupyArrowShaft = (index, id) => {
        if (!arrowshaftOccupied[index])
            arrowshaftOccupied[index] = id;
    };

    const getArrowShaftIndex = (id) => {
        return arrowshaftOccupied.findIndex((occupiedId) => occupiedId === id);
    };

    const freeArrowShaft = (id) => {
        const index = arrowshaftOccupied.indexOf(id);
        if (index !== -1)
            arrowshaftOccupied[index] = false;
        return index;
    };

    /**
     * Shift position whenever toggling visibility.
     * @param {*} entity 
     * @param {*} id 
     * @param {*} arrowshaft_num multiplier to know how many basic shifts to reach that specific arrow shaft
     * @param {boolean} visible 
     */
    const shiftPos = (entity, id, arrowshaft_num, visible) => {
        if (originalPositions[id]) {
            const shift = baseShift[id] * arrowshaft_num;
            const newX = originalPositions[id].x + (visible ? shift : -shift);
            entity.setAttribute("position", {
                x: newX,
                y: originalPositions[id].y,
                z: originalPositions[id].z
            });
        }
        entity.setAttribute("visible", visible);
    };

    /**
     * Set the visibility of a 3D model shifting it to the correct position and update the menu icon style.
     * @param {*} button 
     * @param {*} entities list of a-entity with visibility to be toggled
     * @param {boolean} visible state of visibility to be set
     * @param {string} id identifier for the entity
     */
    const setVisible = (button, entities, visible, id) => {
        const num_visibles = visibility_states.filter((state) => state === true).length - 1;
        let flag = false;

        entities.forEach((entity) => {
            let arrowshaft_num = visible ? Math.min(num_visibles, arrowshaftOccupied.indexOf(false)) : getArrowShaftIndex(id);
            visible ? occupyArrowShaft(arrowshaft_num, id) : freeArrowShaft(id);
            shiftPos(entity, id, arrowshaft_num, visible);
        });

        if (!flag) {
            button.classList.toggle("selected", visible);
        }
    };

    // Wait for the A-Frame scene to load and then get original position and init shift from origin for each 3D model.
    const scene = document.querySelector('a-scene');
    scene.addEventListener('loaded', () => {
        option_icon_ids.forEach((id) => {
            const entity = document.querySelector(`.${id}-entity`);
            if (entity) {
                originalPositions[id] = entity.getAttribute("position");
                baseShift[id] = -originalPositions[id].x;
            }
        });
    });

    // Set initial visibility and add a click event listener to toggle visibility of the 3D model.
    option_icon_ids.forEach((id, index) => {
        const button = document.querySelector(`#${id}`);
        const entities = document.querySelectorAll(`.${id}-entity`);
        setVisible(button, entities, visibility_states[index], id);

        button.addEventListener('click', () => {
            visibility_states[index] = !visibility_states[index];
            setVisible(button, entities, visibility_states[index], id);
        });
    });
});
