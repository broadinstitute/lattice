# Python wrapper for calling js chart files
# each function can accept a number of different parameters using the % decorator
# this is passed as a string to the js files for rendering

from IPython.display import Javascript
import json

print("You now have access to the lattice.js library python wrapper!")

def draw_plot(data, plot_type_input, plot_config={}):
    plot_type = "'{}'".format(plot_type_input) # need to map the string to a double string -- not sure why
    # the 'container' must always be element.get(0) for rendering in Jupyter Notebook
    chart = display(Javascript("""
        (function(element){
            require(['lattice_plot'], function(lattice_plot) {
                lattice_plot(element.get(0), %s, %s, %s);
            });
        })(element);
    """ % (json.dumps(data), plot_type, json.dumps(plot_config))))

def draw_lattice(data, lattice_config={}):
    draw_type = "'lattice'"
    # the 'container' must always be element.get(0) for rendering in Jupyter Notebook
    chart = display(Javascript("""
        (function(element){
            require(['lattice_grid'], function(lattice_grid) {
                lattice_grid(element.get(0), %s, %s);
            });
        })(element);
    """ % (json.dumps(data), json.dumps(lattice_config))))
