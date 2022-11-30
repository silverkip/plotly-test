# Build step #1: build the React front end
WORKDIR /
ENV PATH /node_modules/.bin:$PATH
COPY package.json package-lock.json ./
COPY ./src ./src
RUN npm install
RUN npm build

# Build step #2: build the API with the client as static files
FROM python:3.9
WORKDIR /
COPY --from=build-step /build ./build

RUN mkdir ./api
COPY api/requirements.txt api/api.py api/.flaskenv ./api
RUN pip install -r ./api/requirements.txt
ENV FLASK_ENV production

EXPOSE 3000
WORKDIR /api
CMD ["gunicorn", "-b", ":3000", "api:app"]