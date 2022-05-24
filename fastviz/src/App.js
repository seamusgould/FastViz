import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, LabelList, ResponsiveContainer , Line} from 'recharts';
import React, {useState, useEffect, PureComponent} from 'react';
import moment from 'moment';

import './button.css';
import './App.css';
import Sentiment from 'sentiment';
import axios from "axios";
const sentiment = new Sentiment();



function App() {
console.log("The app is running");

const [headlines, setHeadlines] = useState([]);
const [phrase, setPhrase] = useState("");
const [data, setData] = useState([]);

const clickMe = function () {
  console.log("You clicked me!");
  setPhrase(phrase);
if (phrase !== "") {
  var getArticles = async() => {
  var res = await axios.get(`https://newsapi.org/v2/everything?q=${phrase}&pageSize=100&sortBy=relevancy&apiKey=<API>`); //Place API key here
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

    data.forEach(d => {
      d.date = moment(d.date).valueOf();
    })


    data.sort(function(a, b){
      return a.date - b.date;
    });

    setData(data);
    };

  // render a scatter plot of the sentiment score over time labeled by the title of the article
  // Add a moving average line to the plot.
  return (
    <div className="App">
      <header className="App-header">
        <h1>Sentiment Analysis of Headlines</h1>
        <input value={phrase} onChange={(e) => setPhrase(e.target.value)}
        style = {{padding: "20px", fontSize: "20px", width: "90%"} }
        />
        <h5> Submit a query, and the visualization below will show the frequency and polarity of media coverage sorrounding the topic.</h5>
        <h5> In this case, the lower the number, the more negative coverage, and the higher the number, the more favorable. </h5>
        </header>
        <button class="bn30" onClick={clickMe}>Search</button>
        <div>
          <h5> Results for {phrase} </h5>
          {console.log("The data is: ", data.length)}
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height={500}>
              <ScatterChart width={600} height={300} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid />
                {/* Set the domain to be the first and last date */}
                <XAxis type="number" dataKey="date" name="date" domain={["auto", "auto"]} 
                tickFormatter={(tick) => moment(tick).format("YYYY/MM/DD")}/>
                <YAxis type="number" dataKey="sentiment" name="sentiment" unit=".0" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="sentiment" data={data} fill="#8884d8"/>
              </ScatterChart>
            </ResponsiveContainer>
          ) : (
              <h3>This query is not recognized.</h3>
            )}
        </div>
      </div>
  );
};

export default App;