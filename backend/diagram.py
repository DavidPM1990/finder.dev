import os
import pydot
from sqlalchemy import create_engine, MetaData
from sqlalchemy_schemadisplay import create_schema_graph

# Obtener la ruta completa al ejecutable 'dot'
dot_path = os.path.join(os.environ['PROGRAMFILES'], 'Graphviz', 'bin', 'dot.exe')

# Establecer la ruta al ejecutable 'dot' en Pydot
pydot.Dot.create_prog = dot_path

# Configura la conexión a tu base de datos (ajusta la URL según tu configuración)
engine = create_engine('postgresql://postgres:postgres@localhost:5432/postgres')

# Refleja las tablas existentes en la base de datos
metadata = MetaData()
metadata.reflect(bind=engine)

# Genera el gráfico
graph = create_schema_graph(
    metadata=metadata,
    show_datatypes=True,  # Muestra los tipos de datos
    show_indexes=True,    # Muestra los índices
    rankdir='LR',         # Dirección del gráfico: Left to Right
    concentrate=False,    # Concentra las líneas en los gráficos
    engine=engine         # Pasa el motor explícitamente
)

# Guarda el gráfico en un archivo
graph.write_png('schema.png')
