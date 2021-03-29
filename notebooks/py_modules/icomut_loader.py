from IPython.display import Javascript
import json

print("icomut Python wrapper loaded!")

def plot_icomut(data_file_input, config_file_input):
    data_file = "'{}'".format(data_file_input)
    config_file = "'{}'".format(config_file_input)
    # the 'container' must always be element.get(0) for rendering in Jupyter Notebook
    chart = display(Javascript("""
        (function(element){
            require(['icomut'], function(icomut) {
                icomut(element.get(0), %s, %s);
            });
        })(element);
    """ % (data_file, config_file)))