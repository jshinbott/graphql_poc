# GraphQL exploration

1. run ```npm i && npm start```

2. visit localhost:3001/gql

3. have some fun!

#### things to try: 

return a hard-coded string
```
{
  hello
}
```


return a value derived from input arguments
```
{
  getDie(numSides:6) {
    rollOnce
    roll(numRolls: 3)
  }
}
```

create a record (in locally mocked storage) and return the id
```
mutation {
  createModel(input:{
    fieldA:"some content"
    fieldB:"string val"
  }) {
    id
  }
}
```

once you have that id from the step above, you can use it to fetch that single record
```
{
  getModel(id:1542257814905) {
    id
  }
}
```

... and specify exactly what data you want with it
```
{
  getModel(id:1542257814905) {
    id
    fieldA
    fieldB
  }
}
```
