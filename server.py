from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import math
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/calculate', methods=['POST'])
def calculate():
    try:
        data = request.json
        equation_type = data.get('type')
        params = data.get('params', {})
        
        # Generate x values
        x = np.linspace(-10, 10, 1000)
        
        # Calculate y values based on equation type
        if equation_type == 'parabola':
            a = float(params.get('a', 1))
            y = a * x**2
            
        elif equation_type == 'circle':
            a = float(params.get('a', 1))
            # For circle, we need to generate both positive and negative y values
            y_pos = np.sqrt(a**2 - x**2)
            y_neg = -np.sqrt(a**2 - x**2)
            # Filter out NaN values (points outside the circle)
            valid_indices = ~np.isnan(y_pos)
            x = x[valid_indices]
            y_pos = y_pos[valid_indices]
            y_neg = y_neg[valid_indices]
            # Return both traces for the circle
            return jsonify({
                'x': x.tolist(),
                'y_pos': y_pos.tolist(),
                'y_neg': y_neg.tolist(),
                'type': 'circle'
            })
            
        elif equation_type == 'ellipse':
            a = float(params.get('a', 1))
            b = float(params.get('b', 1))
            # For ellipse, we need to generate both positive and negative y values
            y_pos = b * np.sqrt(1 - (x**2 / a**2))
            y_neg = -b * np.sqrt(1 - (x**2 / a**2))
            # Filter out NaN values (points outside the ellipse)
            valid_indices = ~np.isnan(y_pos)
            x = x[valid_indices]
            y_pos = y_pos[valid_indices]
            y_neg = y_neg[valid_indices]
            # Return both traces for the ellipse
            return jsonify({
                'x': x.tolist(),
                'y_pos': y_pos.tolist(),
                'y_neg': y_neg.tolist(),
                'type': 'ellipse'
            })
            
        elif equation_type == 'hyperbola':
            a = float(params.get('a', 1))
            b = float(params.get('b', 1))
            # For hyperbola, we need to generate both positive and negative y values
            y_pos = b * np.sqrt((x**2 / a**2) - 1)
            y_neg = -b * np.sqrt((x**2 / a**2) - 1)
            # Filter out NaN values (points inside the hyperbola)
            valid_indices = ~np.isnan(y_pos)
            x = x[valid_indices]
            y_pos = y_pos[valid_indices]
            y_neg = y_neg[valid_indices]
            # Return both traces for the hyperbola
            return jsonify({
                'x': x.tolist(),
                'y_pos': y_pos.tolist(),
                'y_neg': y_neg.tolist(),
                'type': 'hyperbola'
            })
            
        elif equation_type == 'sine':
            a = float(params.get('a', 1))
            b = float(params.get('b', 1))
            y = a * np.sin(b * x)
            
        elif equation_type == 'cosine':
            a = float(params.get('a', 1))
            b = float(params.get('b', 1))
            y = a * np.cos(b * x)
            
        elif equation_type == 'exponential':
            a = float(params.get('a', 1))
            b = float(params.get('b', 1))
            y = a * np.exp(b * x)
            
        elif equation_type == 'logarithm':
            a = float(params.get('a', 1))
            b = float(params.get('b', 1))
            # Filter x values to be positive for logarithm
            x = x[x > 0]
            y = a * np.log(b * x)
            
        elif equation_type == 'power':
            a = float(params.get('a', 1))
            b = float(params.get('b', 1))
            y = a * x**b
            
        elif equation_type == 'linear':
            a = float(params.get('a', 1))
            b = float(params.get('b', 0))
            y = a * x + b
            
        elif equation_type == 'cubic':
            a = float(params.get('a', 1))
            b = float(params.get('b', 0))
            c = float(params.get('c', 0))
            d = float(params.get('d', 0))
            y = a * x**3 + b * x**2 + c * x + d
            
        else:
            return jsonify({'error': 'Unsupported equation type'}), 400
        
        # Calculate properties based on equation type
        properties = calculate_properties(equation_type, params, x, y)
        
        return jsonify({
            'x': x.tolist(),
            'y': y.tolist(),
            'type': equation_type,
            'properties': properties
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

def calculate_properties(equation_type, params, x, y):
    """Calculate mathematical properties of the equation"""
    properties = {}
    
    if equation_type == 'parabola':
        a = float(params.get('a', 1))
        properties['vertex'] = {'x': 0, 'y': 0}
        properties['focus'] = {'x': 0, 'y': 1/(4*a)}
        properties['directrix'] = {'y': -1/(4*a)}
        properties['axis_of_symmetry'] = 'x = 0'
        
    elif equation_type == 'circle':
        a = float(params.get('a', 1))
        properties['center'] = {'x': 0, 'y': 0}
        properties['radius'] = a
        properties['area'] = math.pi * a**2
        properties['circumference'] = 2 * math.pi * a
        
    elif equation_type == 'ellipse':
        a = float(params.get('a', 1))
        b = float(params.get('b', 1))
        c = math.sqrt(abs(a**2 - b**2))
        properties['center'] = {'x': 0, 'y': 0}
        properties['major_axis'] = max(a, b)
        properties['minor_axis'] = min(a, b)
        properties['foci'] = [
            {'x': c, 'y': 0} if a > b else {'x': 0, 'y': c},
            {'x': -c, 'y': 0} if a > b else {'x': 0, 'y': -c}
        ]
        properties['eccentricity'] = c / max(a, b)
        properties['area'] = math.pi * a * b
        
    elif equation_type == 'hyperbola':
        a = float(params.get('a', 1))
        b = float(params.get('b', 1))
        c = math.sqrt(a**2 + b**2)
        properties['center'] = {'x': 0, 'y': 0}
        properties['vertices'] = [
            {'x': a, 'y': 0},
            {'x': -a, 'y': 0}
        ]
        properties['foci'] = [
            {'x': c, 'y': 0},
            {'x': -c, 'y': 0}
        ]
        properties['asymptotes'] = [
            f'y = {b/a}x',
            f'y = -{b/a}x'
        ]
        properties['eccentricity'] = c / a
        
    elif equation_type == 'sine':
        a = float(params.get('a', 1))
        b = float(params.get('b', 1))
        properties['amplitude'] = a
        properties['period'] = 2 * math.pi / b
        properties['frequency'] = b / (2 * math.pi)
        properties['phase_shift'] = 0
        
    elif equation_type == 'cosine':
        a = float(params.get('a', 1))
        b = float(params.get('b', 1))
        properties['amplitude'] = a
        properties['period'] = 2 * math.pi / b
        properties['frequency'] = b / (2 * math.pi)
        properties['phase_shift'] = 0
        
    elif equation_type == 'exponential':
        a = float(params.get('a', 1))
        b = float(params.get('b', 1))
        properties['base'] = math.e
        properties['coefficient'] = a
        properties['exponent'] = b
        properties['growth_rate'] = b
        
    elif equation_type == 'logarithm':
        a = float(params.get('a', 1))
        b = float(params.get('b', 1))
        properties['base'] = math.e
        properties['coefficient'] = a
        properties['argument'] = b
        
    elif equation_type == 'power':
        a = float(params.get('a', 1))
        b = float(params.get('b', 1))
        properties['coefficient'] = a
        properties['exponent'] = b
        
    elif equation_type == 'linear':
        a = float(params.get('a', 1))
        b = float(params.get('b', 0))
        properties['slope'] = a
        properties['y_intercept'] = b
        properties['x_intercept'] = -b/a if a != 0 else None
        
    elif equation_type == 'cubic':
        a = float(params.get('a', 1))
        b = float(params.get('b', 0))
        c = float(params.get('c', 0))
        d = float(params.get('d', 0))
        properties['coefficients'] = {
            'a': a,
            'b': b,
            'c': c,
            'd': d
        }
        # Calculate roots (simplified)
        if a != 0:
            # For simplicity, we'll just note that a cubic has at least one real root
            properties['roots'] = 'At least one real root exists'
        else:
            properties['roots'] = 'Not a cubic function (a=0)'
    
    return properties

if __name__ == '__main__':
    app.run(debug=True, port=5000) 