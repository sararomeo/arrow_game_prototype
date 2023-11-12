/**
 * Function to toggle the visibility for each 3D model, put it on the first available arrowshaft and change the style of the corresponding menu icon.
 */
document.addEventListener("DOMContentLoaded", function () {
    const option_icon_ids = ["raschiatoio271435", "arrowhead271422"]; //, "arrowhead271409", "lama_pugnaletto", "arrowhead271407","lama271379"
    const visibility_states = option_icon_ids.map(() => false);
    const baseShift = {};
    const originalPositions = {};
    const arrowshaftOccupied = [false, false, false];
    const occupyArrowShaft = (index, id) => {
        if (!arrowshaftOccupied[index]) {
            arrowshaftOccupied[index] = id;
            console.log(`Arrow shaft ${index} is now occupied by ${id}.`);
        } else {
            console.log(`Arrow shaft ${index} is already occupied by ${arrowshaftOccupied[index]}.`);
        }
        console.log("ARROWSHAFTS", arrowshaftOccupied);
    }
    const getArrowShaftIndex = (id) => {
        return arrowshaftOccupied.findIndex((occupiedId) => occupiedId === id);
    };
    const freeArrowShaft = (id) => {
        const index = arrowshaftOccupied.indexOf(id);
        if (index !== -1) {
            arrowshaftOccupied[index] = false;
            console.log(`Arrow shaft ${index} is now free.`);
        } else {
            console.log(`Arrow shaft associated with ${id} is not occupied.`);
        }
        console.log("ARROWSHAFTS", arrowshaftOccupied);
        return index;
    }

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

    const shiftPos = (entity, id, arrowshaft_num, visible) => {
        if (originalPositions[id]) {
            console.log("VISIBLE: ", visible);
            if (visible) {
                console.log("ORIGINAL POS: ", originalPositions[id])

                const shift = baseShift[id] * arrowshaft_num;
                console.log("shift: ", shift);

                newX = originalPositions[id].x + shift;
                console.log("ORIGINAL POS (" + originalPositions[id].x + ") + shift (" + shift + ") = " + newX);

                entity.setAttribute("position", {
                    x: newX,
                    y: originalPositions[id].y,
                    z: originalPositions[id].z
                });
                console.log("Final x pos: ", newX);
            } else if (!visible) {
                console.log("ORIGINAL POS: ", originalPositions[id])

                const shift = baseShift[id] * arrowshaft_num;
                newX = originalPositions[id].x - shift;
                entity.setAttribute("position", {
                    x: newX,
                    y: originalPositions[id].y,
                    z: originalPositions[id].z
                });
            }
        }
        entity.setAttribute("visible", visible);
    }

    /**
     *  Set the visibility of a 3D model shifting it to the correct position and update the menu icon style.
     * @param {*} button 
     * @param {*} entities list of a-entity with visibility to be toggled
     * @param {boolean} visible state of visibility to be set
     * @param {string} id identifier for the entity
     */
    const setVisible = (button, entities, visible, id) => {
        const num_visibles = visibility_states.filter(state => state == true).length - 1;
        flag = false;

        console.log("\n\n NUM VIS: ", num_visibles);

        entities.forEach(entity => {
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
                        console.log(`do nothin bc >=3`);
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
