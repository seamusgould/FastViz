// Make a web app that
// Allows users to submit a query
// Aggregates the headlines of the query
// Analyzes the sentiment of the aggregated headlines
// Displays the sentiment score over time as a graph
// My api key 9a57a3e23ea54d259e5998d92b1da811
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, LabelList, ResponsiveContainer } from 'recharts';
import React, {useState, useEffect, PureComponent} from 'react';
import './App.css';
import Sentiment from 'sentiment';
import axios from "axios";

const sentiment = new Sentiment();

function App() {
console.log("The app is running");
const [headlines, setHeadlines] = useState([]);
const [sentimentScore, setSentimentScore] = useState(null);
const [phrase, setPhrase] = useState("");
const [data, setData] = useState([]);

const clickMe = function () {
  console.log("You clicked me!");
  setPhrase(phrase);
if (phrase !== "") {
  var getArticles = async() => {
  var res = await axios.get(`https://newsapi.org/v2/everything?q=${phrase}&pageSize=100&sortBy=relevancy&apiKey=5e0bbb0fb11c40c0b5b4fe1ceace49f6`);
  console.log("The response is " + res);
  setHeadlines(res.data.articles);
  };

  getArticles();
    
  var sent_score = 0;
  var sentiments = [];
  var dates = [];
  var titles = [];
  for (let i = 0; i < headlines.length; i++) {
    const headline = headlines[i];
    const description = headline.description;
    const headlineSentiment = sentiment.analyze(description);
    sent_score += headlineSentiment.score;
    sentiments.push(headlineSentiment.score);
    dates.push(headline.publishedAt);
    titles.push(headline.title);
    };
      console.log("The headline dates are: ", dates);
      console.log("The headline sentiments are: ", sentiments);
      console.log("The headline titles are: ", titles);
    };
    
    // Convert dates, sentiments, and titles to to json object like this:
    // [{date: "2020-01-01", sentiment: 1, title: "title1"}, {date: "2020-01-02", sentiment: -1, title: "title2"}]
    var data = [];
    for (let i = 0; i < dates.length; i++) {
      data.push({date: dates[i], sentiment: sentiments[i], title: titles[i]});
    };
    console.log("The data is: ", data);
    setData(data);
    console.log("The data is all set");
  };

  // render a scatter plot of the sentiment score over time labeled by the title of the article

  return (
    <div className="App">
      <header className="App-header">
        <h1>Sentiment Analysis</h1>
        <input value={phrase} onChange={(e) => setPhrase(e.target.value)}
        style = {{padding: "20px", fontSize: "20px", width: "90%"} }
        />
        </header>
        <button onClick={clickMe} >
          Submit
        </button>
        <div>
          <h5> {(Object.keys(data).length === 0) ? data : "Nothing to see here"} </h5>
          <h5> {phrase} </h5>
          <ResponsiveContainer width="100%" height={500}>
            <ScatterChart width={600} height={500} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid />
              <XAxis type="number" dataKey="dates" name="dates" />
              <YAxis type="number" dataKey="sentiments" name="sentiments" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter name="sentiments" data={data} fill="#8884d8" />
              <LabelList dataKey="titles" position="right" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
  );
};

export default App;