# Interactive Mathematical Graphing Application

A web-based application for plotting mathematical equations with interactive features.

## Features

- Plot multiple equations simultaneously
- Support for various equation types (parabola, circle, ellipse, hyperbola, sine, cosine, exponential, logarithm, power, linear, cubic)
- Real-time graph rendering
- Error handling for invalid inputs
- Zoom and pan options
- Light/dark mode toggle
- Mobile-friendly responsive design
- Mathematical properties display
- Client-side calculations (no server required)

## Setup

1. Simply open `index.html` in your web browser

## Usage

1. Select an equation type from the dropdown menu
2. Enter values for any parameters (a, b, c, etc.)
3. Click "Plot" to render the graph
4. Add more equations by clicking "Add Equation"
5. Toggle between light and dark mode using the theme switch

## Supported Mathematical Functions

- Parabola: y = ax²
- Circle: x² + y² = a²
- Ellipse: (x²/a²) + (y²/b²) = 1
- Hyperbola: (x²/a²) - (y²/b²) = 1
- Sine Wave: y = a*sin(bx)
- Cosine Wave: y = a*cos(bx)
- Exponential: y = a*e^(bx)
- Logarithm: y = a*ln(bx)
- Power Function: y = ax^b
- Linear: y = ax + b
- Cubic: y = ax³ + bx² + cx + d

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Bootstrap 5
- Plotly.js for graphing

## Troubleshooting

### Common Problems and Solutions

#### 1. Graph Not Displaying
- **Problem**: The graph container is empty after clicking "Plot"
- **Solution**: 
  - Check your internet connection (Plotly.js is loaded from CDN)
  - Open browser developer tools (F12) and check the console for errors
  - Verify that all parameter values are valid numbers
  - Try refreshing the page

#### 2. Invalid Equation Errors
- **Problem**: "Invalid equation" error message appears
- **Solution**:
  - Ensure all parameters are positive numbers where required (e.g., radius for circle)
  - Check that you've entered all required parameters for the selected equation type
  - For logarithmic functions, ensure the base (b) is greater than 0 and not equal to 1

#### 3. Graph Display Issues
- **Problem**: Graph appears distorted or incorrect
- **Solution**:
  - Adjust the parameter values to more reasonable ranges
  - For very large or small values, try using scientific notation (e.g., 1e-6 instead of 0.000001)
  - For periodic functions like sine/cosine, try smaller values for the frequency parameter (b)

#### 4. Performance Issues
- **Problem**: Application runs slowly with multiple equations
- **Solution**:
  - Reduce the number of simultaneous equations
  - Close other browser tabs to free up memory
  - Try using a more modern browser

#### 5. Mobile Display Problems
- **Problem**: Layout looks incorrect on mobile devices
- **Solution**:
  - Ensure you're using the latest version of your mobile browser
  - Try rotating your device to landscape mode for better graph visibility
  - Zoom out slightly to see the full interface

#### 6. Theme Switching Issues
- **Problem**: Dark/light mode toggle doesn't work properly
- **Solution**:
  - Clear your browser cache and reload the page
  - Check if your browser has any dark mode extensions that might conflict

#### 7. Mathematical Properties Not Showing
- **Problem**: Properties section remains empty after plotting
- **Solution**:
  - Ensure you've selected a supported equation type
  - Check that all required parameters are provided
  - Try plotting a simpler equation first to verify functionality 