FROM python:3.12

COPY requirements.txt /requirements.txt
RUN pip install -r requirements.txt

COPY quotes/quotes.txt /quotes/quotes.txt
COPY funfacts/funfacts.txt /funfacts/funfacts.txt

COPY main.py /main.py

CMD ["python", "/main.py"]

LABEL \
  "name"="Auto Update Quote" \
  "homepage"="https://github.com/marketplace/actions/auto-update-quote" \
  "repository"="https://github.com/offensive-vk/auto-update-quote" \
  "maintainer"="TheHamsterBot <TheHamsterBot@users.noreply.github.com>"
