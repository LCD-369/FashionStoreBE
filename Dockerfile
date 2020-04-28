FROM node:latest
COPY ./ 
RUN npm install
EXPOSE 3000
ENV RDS_HOSTNAME nodelmsdb.c50mtbwfhaw7.us-east-1.rds.amazonaws.com
ENV RDS_USERNAME admin
ENV RDS_PASSWORD password
ENV RDS_PORT 3306
ENTRYPOINT ["npm", "serve"]
