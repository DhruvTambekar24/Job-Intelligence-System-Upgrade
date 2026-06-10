FROM apache/airflow:2.10.5

# Copy requirements as airflow user
COPY --chown=airflow:root requirements-airflow.txt /tmp/requirements-airflow.txt

# Install packages as airflow user
RUN pip install --no-cache-dir -r /tmp/requirements-airflow.txt

# Copy your project
COPY --chown=airflow:root . /opt/airflow/project
COPY --chown=airflow:root airflow/dags /opt/airflow/dags

ENV AIRFLOW_PROJECT_ROOT=/opt/airflow/project
ENV AIRFLOW_PROJECT_ROOT=/opt/airflow/project
ENV PYTHONPATH=/opt/airflow/project