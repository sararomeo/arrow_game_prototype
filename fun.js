document.addEventListener("DOMContentLoaded", function () {
    const option_icon_ids = ["raschiatoio271435", "arrowhead271422", "arrowhead271409", "lama_pugnaletto", "arrowhead271407", "lama271379"];
    const visibility_states = option_icon_ids.map(() => false);
    const baseShift = 0.5; // distance between each arrowshaft
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
            const shift = baseShift * arrowshaft_num;
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
     * @param {*} button corresponding img element in top menu button
     * @param {*} entities list of a-entity with visibility to be toggled
     * @param {boolean} visible state of visibility to be set
     * @param {string} id identifier for the entity
     */
    const setVisible = (button, entities, visible, num_visibles, id) => {
        entities.forEach((entity) => {
            if (visible) {
                const arrowshaft_num = Math.min(num_visibles, arrowshaftOccupied.indexOf(false));
                occupyArrowShaft(arrowshaft_num, id);
                shiftPos(entity, id, arrowshaft_num, visible);
            } else {
                const indexx = getArrowShaftIndex(id);
                freeArrowShaft(id);
                shiftPos(entity, id, indexx, visible); // put into the original position
            }
        });

        button.classList.toggle("selected", visible);
    };

    // Wait for the A-Frame scene to load and then get original position and init shift from origin for each 3D model.
    const scene = document.querySelector('a-scene');
    scene.addEventListener('loaded', () => {
        option_icon_ids.forEach((id) => {
            const entity = document.querySelector(`.${id}-entity`);
            if (entity)
                originalPositions[id] = entity.getAttribute("position");
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

    /** GAME BUTTONS ACTIONS **/
    const changeArrowShaftColor = (number, color) => {
        const arrowShaftElement = document.getElementById("arrowshaft" + number);
        if (arrowShaftElement)
            arrowShaftElement.setAttribute("color", color);
    }

    function getComputedDisplay(id) {
        const element = document.getElementById(id);
        const computedStyle = window.getComputedStyle(element);
        return computedStyle.getPropertyValue("display");
    }

    function showGameInstructions() {
        document.getElementById("instructionsPopup").style.display = "block";
    }

    function showScore() {
        let score = 0;
        arrowshaftOccupied.forEach((el, index) => {            
            const button = document.querySelector(`#${el}`);
            if (el != false && el.startsWith("arrowhead")) {
                score = score + 1;
                changeArrowShaftColor(index + 1, "green");
            } else {
                if(el != false)
                    button.classList.add("wrongAnswer"); // change color of corresponding icon too
                changeArrowShaftColor(index + 1, "red");
            }
        })
        document.getElementById("score-value").textContent = score + "/3";
        document.getElementById("scorePopup").style.display = "block";
    }

    function closePopup(id) {
        document.querySelector(`#${id}`).style.display = "none";
    }

    // Function to enable or disable top menu buttons
    const disableImageButtons = (disabled) => {
        const imageButtons = document.querySelectorAll('.optionsMenu img');
        imageButtons.forEach((button) => {
            button.classList.toggle("disabled", disabled);
            if (disabled == false && button.classList.length > 0) {
                if(button.classList.contains("wrongAnswer"))
                    button.classList.remove("wrongAnswer");
            }
        });
    };

    function resetGame() {
        // reset original arrowshaft color
        for (i = 1; i <= 3; i++)
            changeArrowShaftColor(i, "#492201");

        // hide all currently visible 3D models
        option_icon_ids.forEach((id, index) => {
            const button = document.querySelector(`#${id}`);
            const entities = document.querySelectorAll(`.${id}-entity`);
            if (visibility_states[index]) {
                visibility_states[index] = !visibility_states[index];
                setVisible(button, entities, visibility_states[index], 0, id);
            }
        });

        // enable menu buttons
        disableImageButtons(false);
    }

    document.querySelector('.gameActionsContainer').addEventListener('click', function (event) {
        const target = event.target;

        if (target.matches('#instructionsButton')) {
            if (getComputedDisplay("scorePopup") == "none" || document.getElementById("scorePopup").style.display == "none")
                showGameInstructions();
        } else if (target.matches('#scoreButton')) {
            if (getComputedDisplay("instructionsPopup") == "none" || document.getElementById("instructionsPopup").style.display == "none")
                showScore();
        } else if (target.matches('#instructionsPopup .closePopup')) {
            closePopup('instructionsPopup');
        } else if (target.matches('.scorePopupButtons .closePopup')) {
            closePopup('scorePopup');
            disableImageButtons(true);
        } else if (target.matches('.scorePopupButtons .resetGame')) {
            resetGame();
            closePopup('scorePopup');
        }
    });
});
