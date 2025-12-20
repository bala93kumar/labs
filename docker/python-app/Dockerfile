FROM python:3.11-alpine

RUN adduser -D myuser
WORKDIR /app
RUN chown myuser:myuser /app


COPY --chown=myuser:myuser bmi.py /app/bmi.py

USER myuser

# Default command: run the script
CMD ["python","bmi.py"]
