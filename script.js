// Global variables
let equationCount = 1;

// Function to add a new equation input field
function addEquation() {
    equationCount++;
    const equationContainer = document.getElementById('equations-container');
    
    const equationDiv = document.createElement('div');
    equationDiv.className = 'equation-input mb-3';
    equationDiv.id = `equation-${equationCount}`;
    
    equationDiv.innerHTML = `
        <div class="card">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <h5 class="card-title">Equation ${equationCount}</h5>
                    <button class="btn btn-sm btn-danger" onclick="removeEquation(${equationCount})">Remove</button>
                </div>
                <div class="mb-3">
                    <label class="form-label">Equation Type</label>
                    <select class="form-select equation-type" onchange="updateParameterInputs(${equationCount})">
                        <option value="parabola">Parabola (y = ax²)</option>
                        <option value="circle">Circle (x² + y² = a²)</option>
                        <option value="ellipse">Ellipse ((x²/a²) + (y²/b²) = 1)</option>
                        <option value="hyperbola">Hyperbola ((x²/a²) - (y²/b²) = 1)</option>
                        <option value="sine">Sine Wave (y = a*sin(bx))</option>
                        <option value="cosine">Cosine Wave (y = a*cos(bx))</option>
                        <option value="exponential">Exponential (y = a*e^(bx))</option>
                        <option value="logarithm">Logarithm (y = a*ln(bx))</option>
                        <option value="power">Power Function (y = ax^b)</option>
                        <option value="linear">Linear (y = ax + b)</option>
                        <option value="cubic">Cubic (y = ax³ + bx² + cx + d)</option>
                    </select>
                </div>
                <div class="parameter-inputs">
                    <div class="mb-3">
                        <label class="form-label">Parameter a</label>
                        <input type="number" class="form-control parameter-a" value="1" step="0.1">
                    </div>
                    <div class="mb-3 parameter-b-container" style="display: none;">
                        <label class="form-label">Parameter b</label>
                        <input type="number" class="form-control parameter-b" value="1" step="0.1">
                    </div>
                    <div class="mb-3 parameter-c-container" style="display: none;">
                        <label class="form-label">Parameter c</label>
                        <input type="number" class="form-control parameter-c" value="0" step="0.1">
                    </div>
                    <div class="mb-3 parameter-d-container" style="display: none;">
                        <label class="form-label">Parameter d</label>
                        <input type="number" class="form-control parameter-d" value="0" step="0.1">
                    </div>
                </div>
            </div>
        </div>
    `;
    
    equationContainer.appendChild(equationDiv);
}

// Function to remove an equation input field
function removeEquation(id) {
    const equationDiv = document.getElementById(`equation-${id}`);
    equationDiv.remove();
}

// Function to update parameter input fields based on equation type
function updateParameterInputs(id) {
    const equationDiv = document.getElementById(`equation-${id}`);
    const equationType = equationDiv.querySelector('.equation-type').value;
    
    // Hide all parameter containers first
    equationDiv.querySelector('.parameter-b-container').style.display = 'none';
    equationDiv.querySelector('.parameter-c-container').style.display = 'none';
    equationDiv.querySelector('.parameter-d-container').style.display = 'none';
    
    // Show relevant parameter containers based on equation type
    if (equationType === 'ellipse' || equationType === 'hyperbola' || 
        equationType === 'sine' || equationType === 'cosine' || 
        equationType === 'exponential' || equationType === 'logarithm' || 
        equationType === 'power' || equationType === 'linear') {
        equationDiv.querySelector('.parameter-b-container').style.display = 'block';
    }
    
    if (equationType === 'cubic') {
        equationDiv.querySelector('.parameter-b-container').style.display = 'block';
        equationDiv.querySelector('.parameter-c-container').style.display = 'block';
        equationDiv.querySelector('.parameter-d-container').style.display = 'block';
    }
}

// Function to clear error message
function clearError() {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = '';
    errorDiv.style.display = 'none';
}

// Function to display error message
function showError(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

// Function to calculate equation values
function calculateEquationValues(equationType, params) {
    // Generate x values
    const xValues = [];
    for (let x = -10; x <= 10; x += 0.1) {
        xValues.push(x);
    }
    
    let yValues = [];
    let yPosValues = [];
    let yNegValues = [];
    let properties = {};
    
    // Calculate y values based on equation type
    if (equationType === 'parabola') {
        const a = parseFloat(params.a);
        yValues = xValues.map(x => a * x * x);
        
        // Calculate properties
        properties = {
            vertex: { x: 0, y: 0 },
            focus: { x: 0, y: 1/(4*a) },
            directrix: { y: -1/(4*a) },
            axis_of_symmetry: 'x = 0'
        };
    } 
    else if (equationType === 'circle') {
        const a = parseFloat(params.a);
        yPosValues = xValues.map(x => Math.sqrt(a*a - x*x));
        yNegValues = xValues.map(x => -Math.sqrt(a*a - x*x));
        
        // Filter out NaN values (points outside the circle)
        const validIndices = yPosValues.map((y, i) => !isNaN(y)).filter(Boolean);
        const validX = xValues.filter((x, i) => validIndices[i]);
        const validYPos = yPosValues.filter((y, i) => validIndices[i]);
        const validYNeg = yNegValues.filter((y, i) => validIndices[i]);
        
        // Calculate properties
        properties = {
            center: { x: 0, y: 0 },
            radius: a,
            area: Math.PI * a * a,
            circumference: 2 * Math.PI * a
        };
        
        return {
            x: validX,
            y_pos: validYPos,
            y_neg: validYNeg,
            type: 'circle',
            properties: properties
        };
    } 
    else if (equationType === 'ellipse') {
        const a = parseFloat(params.a);
        const b = parseFloat(params.b);
        yPosValues = xValues.map(x => b * Math.sqrt(1 - (x*x)/(a*a)));
        yNegValues = xValues.map(x => -b * Math.sqrt(1 - (x*x)/(a*a)));
        
        // Filter out NaN values (points outside the ellipse)
        const validIndices = yPosValues.map((y, i) => !isNaN(y)).filter(Boolean);
        const validX = xValues.filter((x, i) => validIndices[i]);
        const validYPos = yPosValues.filter((y, i) => validIndices[i]);
        const validYNeg = yNegValues.filter((y, i) => validIndices[i]);
        
        // Calculate properties
        const c = Math.sqrt(Math.abs(a*a - b*b));
        properties = {
            center: { x: 0, y: 0 },
            major_axis: Math.max(a, b),
            minor_axis: Math.min(a, b),
            foci: [
                a > b ? { x: c, y: 0 } : { x: 0, y: c },
                a > b ? { x: -c, y: 0 } : { x: 0, y: -c }
            ],
            eccentricity: c / Math.max(a, b),
            area: Math.PI * a * b
        };
        
        return {
            x: validX,
            y_pos: validYPos,
            y_neg: validYNeg,
            type: 'ellipse',
            properties: properties
        };
    } 
    else if (equationType === 'hyperbola') {
        const a = parseFloat(params.a);
        const b = parseFloat(params.b);
        yPosValues = xValues.map(x => b * Math.sqrt((x*x)/(a*a) - 1));
        yNegValues = xValues.map(x => -b * Math.sqrt((x*x)/(a*a) - 1));
        
        // Filter out NaN values (points inside the hyperbola)
        const validIndices = yPosValues.map((y, i) => !isNaN(y)).filter(Boolean);
        const validX = xValues.filter((x, i) => validIndices[i]);
        const validYPos = yPosValues.filter((y, i) => validIndices[i]);
        const validYNeg = yNegValues.filter((y, i) => validIndices[i]);
        
        // Calculate properties
        const c = Math.sqrt(a*a + b*b);
        properties = {
            center: { x: 0, y: 0 },
            vertices: [
                { x: a, y: 0 },
                { x: -a, y: 0 }
            ],
            foci: [
                { x: c, y: 0 },
                { x: -c, y: 0 }
            ],
            asymptotes: [
                `y = ${b/a}x`,
                `y = -${b/a}x`
            ],
            eccentricity: c / a
        };
        
        return {
            x: validX,
            y_pos: validYPos,
            y_neg: validYNeg,
            type: 'hyperbola',
            properties: properties
        };
    } 
    else if (equationType === 'sine') {
        const a = parseFloat(params.a);
        const b = parseFloat(params.b);
        yValues = xValues.map(x => a * Math.sin(b * x));
        
        // Calculate properties
        properties = {
            amplitude: a,
            period: 2 * Math.PI / b,
            frequency: b / (2 * Math.PI),
            phase_shift: 0
        };
    } 
    else if (equationType === 'cosine') {
        const a = parseFloat(params.a);
        const b = parseFloat(params.b);
        yValues = xValues.map(x => a * Math.cos(b * x));
        
        // Calculate properties
        properties = {
            amplitude: a,
            period: 2 * Math.PI / b,
            frequency: b / (2 * Math.PI),
            phase_shift: 0
        };
    } 
    else if (equationType === 'exponential') {
        const a = parseFloat(params.a);
        const b = parseFloat(params.b);
        yValues = xValues.map(x => a * Math.exp(b * x));
        
        // Calculate properties
        properties = {
            base: Math.E,
            coefficient: a,
            exponent: b,
            growth_rate: b
        };
    } 
    else if (equationType === 'logarithm') {
        const a = parseFloat(params.a);
        const b = parseFloat(params.b);
        // Filter x values to be positive for logarithm
        const positiveX = xValues.filter(x => x > 0);
        yValues = positiveX.map(x => a * Math.log(b * x));
        
        // Calculate properties
        properties = {
            base: Math.E,
            coefficient: a,
            argument: b
        };
        
        return {
            x: positiveX,
            y: yValues,
            type: 'logarithm',
            properties: properties
        };
    } 
    else if (equationType === 'power') {
        const a = parseFloat(params.a);
        const b = parseFloat(params.b);
        yValues = xValues.map(x => a * Math.pow(x, b));
        
        // Calculate properties
        properties = {
            coefficient: a,
            exponent: b
        };
    } 
    else if (equationType === 'linear') {
        const a = parseFloat(params.a);
        const b = parseFloat(params.b);
        yValues = xValues.map(x => a * x + b);
        
        // Calculate properties
        properties = {
            slope: a,
            y_intercept: b,
            x_intercept: a !== 0 ? -b/a : null
        };
    } 
    else if (equationType === 'cubic') {
        const a = parseFloat(params.a);
        const b = parseFloat(params.b);
        const c = parseFloat(params.c);
        const d = parseFloat(params.d);
        yValues = xValues.map(x => a * Math.pow(x, 3) + b * Math.pow(x, 2) + c * x + d);
        
        // Calculate properties
        properties = {
            coefficients: {
                a: a,
                b: b,
                c: c,
                d: d
            },
            roots: a !== 0 ? 'At least one real root exists' : 'Not a cubic function (a=0)'
        };
    }
    
    return {
        x: xValues,
        y: yValues,
        type: equationType,
        properties: properties
    };
}

// Function to plot equations
function plotEquations() {
    try {
        clearError();
        
        // Get all equation inputs
        const equationInputs = document.querySelectorAll('.equation-input');
        const traces = [];
        
        // Process each equation
        for (let i = 0; i < equationInputs.length; i++) {
            const equationDiv = equationInputs[i];
            const equationType = equationDiv.querySelector('.equation-type').value;
            
            // Get parameters
            const params = {
                a: parseFloat(equationDiv.querySelector('.parameter-a').value)
            };
            
            // Add additional parameters if needed
            if (equationType === 'ellipse' || equationType === 'hyperbola' || 
                equationType === 'sine' || equationType === 'cosine' || 
                equationType === 'exponential' || equationType === 'logarithm' || 
                equationType === 'power' || equationType === 'linear' || 
                equationType === 'cubic') {
                params.b = parseFloat(equationDiv.querySelector('.parameter-b').value);
            }
            
            if (equationType === 'cubic') {
                params.c = parseFloat(equationDiv.querySelector('.parameter-c').value);
                params.d = parseFloat(equationDiv.querySelector('.parameter-d').value);
            }
            
            // Calculate equation values
            const data = calculateEquationValues(equationType, params);
            
            // Create trace based on equation type
            if (equationType === 'circle' || equationType === 'ellipse' || equationType === 'hyperbola') {
                // For shapes that need two traces (positive and negative y values)
                traces.push({
                    x: data.x,
                    y: data.y_pos,
                    type: 'scatter',
                    mode: 'lines',
                    name: `Equation ${i+1} (${equationType})`
                });
                
                traces.push({
                    x: data.x,
                    y: data.y_neg,
                    type: 'scatter',
                    mode: 'lines',
                    name: `Equation ${i+1} (${equationType})`,
                    showlegend: false
                });
            } else {
                // For standard equations
                traces.push({
                    x: data.x,
                    y: data.y,
                    type: 'scatter',
                    mode: 'lines',
                    name: `Equation ${i+1} (${equationType})`
                });
            }
            
            // Display properties if available
            if (data.properties) {
                displayProperties(data.properties, i+1);
            }
        }
        
        // Create layout
        const layout = {
            title: 'Graph',
            xaxis: {
                title: 'x',
                gridcolor: '#ddd',
                zerolinecolor: '#999',
                range: [-10, 10]
            },
            yaxis: {
                title: 'y',
                gridcolor: '#ddd',
                zerolinecolor: '#999',
                range: [-10, 10]
            },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            showlegend: true,
            legend: {
                x: 1,
                xanchor: 'right',
                y: 1
            }
        };
        
        // Plot the graph
        Plotly.newPlot('graph-container', traces, layout, {
            responsive: true
        });
        
    } catch (error) {
        showError(error.message);
        console.error('Error plotting equations:', error);
    }
}

// Function to display mathematical properties
function displayProperties(properties, equationNumber) {
    const propertiesContainer = document.getElementById('properties-container');
    
    // Create or get the properties card for this equation
    let propertiesCard = document.getElementById(`properties-card-${equationNumber}`);
    
    if (!propertiesCard) {
        propertiesCard = document.createElement('div');
        propertiesCard.id = `properties-card-${equationNumber}`;
        propertiesCard.className = 'card mb-3';
        propertiesCard.innerHTML = `
            <div class="card-header">
                <h5 class="mb-0">Properties for Equation ${equationNumber}</h5>
            </div>
            <div class="card-body">
                <div id="properties-content-${equationNumber}"></div>
            </div>
        `;
        propertiesContainer.appendChild(propertiesCard);
    }
    
    const propertiesContent = document.getElementById(`properties-content-${equationNumber}`);
    propertiesContent.innerHTML = '';
    
    // Display properties based on equation type
    for (const [key, value] of Object.entries(properties)) {
        if (typeof value === 'object' && value !== null) {
            // Handle nested objects
            propertiesContent.innerHTML += `<p><strong>${key}:</strong></p>`;
            for (const [nestedKey, nestedValue] of Object.entries(value)) {
                propertiesContent.innerHTML += `<p>&nbsp;&nbsp;&nbsp;&nbsp;${nestedKey}: ${nestedValue}</p>`;
            }
        } else if (Array.isArray(value)) {
            // Handle arrays
            propertiesContent.innerHTML += `<p><strong>${key}:</strong></p>`;
            value.forEach((item, index) => {
                if (typeof item === 'object') {
                    for (const [itemKey, itemValue] of Object.entries(item)) {
                        propertiesContent.innerHTML += `<p>&nbsp;&nbsp;&nbsp;&nbsp;${itemKey}: ${itemValue}</p>`;
                    }
                } else {
                    propertiesContent.innerHTML += `<p>&nbsp;&nbsp;&nbsp;&nbsp;${item}</p>`;
                }
            });
        } else {
            // Handle simple values
            propertiesContent.innerHTML += `<p><strong>${key}:</strong> ${value}</p>`;
        }
    }
}

// Function to toggle dark mode
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
}

// Initialize dark mode from localStorage
document.addEventListener('DOMContentLoaded', function() {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    }
    
    // Initialize parameter inputs for the first equation
    updateParameterInputs(1);
}); 