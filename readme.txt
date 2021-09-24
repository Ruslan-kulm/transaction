Constraints: [
Bank handles duplicated requests consistently,
If request have "id" and "customerId" the same as in existing transaction, we ignore "urlId"
]


Endpoints:
http://localhost:8000/api/v1/urls | GET, POST
http://localhost:8000/api/v1/urls/id | GET, PATCH, DELETE

http://localhost:8000/api/v1/transactions | POST
http://localhost:8000/api/v1/transactions/id | GET


Create transaction example:
{
"id": "eredwy22yer",
"customerId": "fdsdgfgggfysdgsd",
"amount": 123,
"date": "2009-02-29",
"urlId": 1
}



