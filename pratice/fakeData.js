export default {
  users: [
    {
      id: 1,
      name: 'Fong',
      age: 23,
      friendIds: [2, 3],
    },
    {
      id: 2,
      name: 'Kevin',
      age: 40,
      friendIds: [1],
    },
    {
      id: 3,
      name: 'Mary',
      age: 18,
      friendIds: [1],
    }],
    posts:[
      { id: 1, authorId: 1, title: "Hello World!", content: "This is my first post.", likeGiverIds: [2] },
      { id: 2, authorId: 2, title: "Good Night", content: "Have a Nice Dream =)", likeGiverIds: [2, 3] },
      { id: 3, authorId: 1, title: "I Love U", content: "Here's my second post!", likeGiverIds: [] },
    ],
}