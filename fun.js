document.addEventListener("DOMContentLoaded", function () {
    const option_icon_ids = ["raschiatoio271435", "arrowhead271422", "braciere", "lama_pugnaletto"]; //, "arrowhead271409", "lama_pugnaletto", "arrowhead271407","lama271379"
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

    const initVisible = (button, entities, visible) => {
        entities.forEach((entity) => {
            entity.setAttribute("visible", visible);
        });
        button.classList.toggle("selected", visible);
    }

    /**
     * Set the visibility of a 3D model shifting it to the correct position and update the menu icon style.
     * @param {*} button 
     * @param {*} entities list of a-entity with visibility to be toggled
     * @param {boolean} visible state of visibility to be set
     * @param {string} id identifier for the entity
     */
    const setVisible = (button, entities, visible, num_visibles, id) => {
        let flag = false;
        console.log("NUM_VIS = ", num_visibles);

        entities.forEach((entity) => {
            if (visible) {
                switch (num_visibles) {
                    case 0:
                        arrowshaft_num = 0;
                        occupyArrowShaft(arrowshaft_num, id);
                        shiftPos(entity, id, arrowshaft_num, visible);
                        break;
                    case 1:
                        if (arrowshaftOccupied[0] != false) {
                            arrowshaft_num = 1;
                        } else {
                            arrowshaft_num = 0;
                        }
                        occupyArrowShaft(arrowshaft_num, id);
                        shiftPos(entity, id, arrowshaft_num, visible);
                        break;
                    case 2:
                        if (arrowshaftOccupied[0] != false && arrowshaftOccupied[1] != false) {
                            arrowshaft_num = 2;
                        } else if (arrowshaftOccupied[0] != false && arrowshaftOccupied[2] != false) {
                            arrowshaft_num = 1;
                        } else if (arrowshaftOccupied[1] != false && arrowshaftOccupied[2] != false) {
                            arrowshaft_num = 0;
                        }
                        occupyArrowShaft(arrowshaft_num, id);                        
                        shiftPos(entity, id, arrowshaft_num, visible);
                        break;
                    default:
                        flag = true;
                        console.log(`do nothing bc >=3`);
                        break;
                    }
            } else {
                indexx = getArrowShaftIndex(id);
                freeArrowShaft(id);
                shiftPos(entity, id, indexx, visible); // put into original pos
            }
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
        initVisible(button, entities, visibility_states[index]);
        
        button.addEventListener('click', () => {
            const num_visibles = visibility_states.filter((state) => state === true).length;
            if (num_visibles != 3 || (num_visibles >= 3 && [...entities].every(entity => entity.getAttribute("visible")))) {
                visibility_states[index] = !visibility_states[index];
                setVisible(button, entities, visibility_states[index], num_visibles, id);
            }
        });
    });
});
