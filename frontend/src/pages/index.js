import Head from 'next/head';
import { Box, Container, Unstable_Grid2 as Grid } from '@mui/material';
import { Layout as DashboardLayout } from '../layouts/dashboard/layout';
import { OverviewBudget } from '../sections/overview/overview-revenue';
import { OverviewSales } from '../sections/overview/overview-revenue-generated';
import { OverviewTasksProgress } from '../sections/overview/overview-payback-period';
import { OverviewTotalCustomers } from '../sections/overview/overview-time-construction-est';
import { OverviewTotalProfit } from '../sections/overview/overview-total-profit';
import { GraphQLClient } from 'graphql-request';
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';



const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const apiKey = process.env.NEXT_PUBLIC_G_API_KEY;
console.log(API_KEY);
const endpoint = 'https://gateway-external.1build.com/';

const now = new Date();

const graphQLClient = new GraphQLClient(endpoint, {
  headers: {
    '1build-api-key': API_KEY
  }
});

const Page = () =>{

  const [systemData, setSystemData] = useState(null);
  const [results, setResults] = useState([]);
  const [fetchStatus, setFetchStatus] = useState('idle');
  const [totalCost, setTotalCost] = useState(0);
  const [revenue, setRevenue] = useState(0); 
  const [construction, setConstruction] = useState(0);
  const [MWH, setMWH] = useState(0);
  
  async function fetchVars() {
    const address  = Cookies.get('Address');
    const square_feet = parseInt(Cookies.get('Area'), 10);
    try {
      const dataObj = {
        address: address,
        square_feet: square_feet,
      };

      setFetchStatus('loading');

      const res = await fetch('https://main-bvxea6i-c53ehmp33lr66.us.platformsh.site/data/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataObj),
      });

      if (res.ok) {
        const data = await res.json();
        setSystemData(data);
        setFetchStatus('success');
        return data
      } else {
        console.error('Failed to fetch data');
        setFetchStatus('error');
      }
    } catch (error) {
      console.error('Error:', error);
      setFetchStatus('error');
    }
  }

async function fetchData(searchTerm, data) {
  const query = `
    query sources($input: SourceSearchInput!) {
      sources(input: $input) {
        nodes {
          calculatedUnitRateUsdCents
        }
      }
    }
  `;
  console.log(data)
  const variables = {
    input: {
      zipcode: data['Zip Code'], // Use zipcode instead of state and county
      searchTerm: searchTerm, // Use the provided search term
      page: {
        limit: 1
      }
    }
  };

  try {
    const response = await graphQLClient.request(query, variables);

    // Extract data from the response
    const {calculatedUnitRateUsdCents} = response.sources.nodes[0];

    // Create a new result object with the search term and rates
    const newResult = {
      searchTerm: searchTerm,
      calculatedUnitRate: calculatedUnitRateUsdCents,
    };


    // Update state with the new result
    

    return newResult
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}


async function fetchPricing(data){
  // const apiKey = 'OXKpwo9bN2usuPUxgw3c74K9HOfg0sCS2Ws1kBxY';
  
  const url = `https://developer.nrel.gov/api/utility_rates/v3.json?api_key=${apiKey}&lat=${data['latitude']}&lon=${data['longitude']}`;

  try {
      const response = await fetch(url);
      
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }

      const price = await response.json();
      return price;
  } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      return null;
  }
}



async function getResults() {
const localResults = [];

const data = await fetchVars();
const searchTerms = ["concrete pad footing 24", "3000", "#5 rebar", "#4 Rebar", "4000", "W24 X 55", "EPDM" ];

for (const searchTerm of searchTerms) {
    const x = await fetchData(searchTerm, data);
    if(x) {
        localResults.push(x);
    }
}

setResults(localResults);
console.log(localResults);
const sortedResults = [...localResults].sort((a, b) => a.searchTerm.localeCompare(b.searchTerm));

  const price = await fetchPricing(data);
  console.log(sortedResults)
  let totalCost = 0
  totalCost = ((sortedResults[0].calculatedUnitRate) + sortedResults[1].calculatedUnitRate+ sortedResults[2].calculatedUnitRate * 8 + sortedResults[3].calculatedUnitRate * 185 + sortedResults[4].calculatedUnitRate * 4 +  sortedResults[5].calculatedUnitRate * 40 + sortedResults[6].calculatedUnitRate * 4) / 100
  setConstruction(totalCost)
  totalCost = totalCost + (data['System Size (KW)'] * 500 * 2.88);
  setMWH(data['KWH per year'])
  const rev = data['KWH per year'] *  price.outputs.commercial;
  setTotalCost(totalCost);
  setRevenue(rev);
}

useEffect(() => {
  console.log('Running useEffect');
  getResults();
}, []);


const generateFutureValueData = (PV, R, TStart, TEnd, step) => {
  const data = [];
  for(let T = TStart; T < TEnd; T += step) {
    let FV = PV * Math.pow(1 + R, T);
    FV = Math.round(FV); // Round to the nearest integer
    FV = FV / 1000;
    FV = Math.round(FV); // Convert to terms of K
    data.push(FV);
  }
  return data;
};

const generateCost = (cost) => {
  const data = []
  cost = cost / 1000
  cost = Math.round(cost)
  for(let T = 0; T < 12; T+= 1){
    data.push(cost)
  } 
  return data
}

console.log(revenue)
const PV = revenue; // Replace with your revenue value from state
const R = 0.05;
const futureValueData = generateFutureValueData(PV, R, 0, 60, 5);
const costVal = generateCost(totalCost);
console.log(costVal);
const KWH = MWH;
const OUTPUTS = `${KWH} KWH`;

  return (
  <>
  
    <Head>
      <title>
        
        Overview | SolarEstimation
      </title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth="xl">
        <Grid
          container
          spacing={3}
        >
          <Grid
            xs={12}
            sm={6}
            lg={3}
          >
            <OverviewBudget
              difference={12}
              positive
              sx={{ height: '100%' }}
              value= {revenue}
            />
          </Grid>
          <Grid
            xs={12}
            sm={6}
            lg={3}
          >
            <OverviewTotalProfit
              sx={{ height: '100%' }}
              value={construction}
            />
          </Grid>
          <Grid
            xs={12}
            sm={6}
            lg={3}
          >
          </Grid>
          <Grid
            xs={12}
            sm={6}
            lg={3}
          >
            <OverviewTotalCustomers
              sx={{ height: '100%' }}
              value = {OUTPUTS}
            />
          </Grid>
          <Grid
            xs={12}
            lg={12}
          >
            <OverviewSales
              chartSeries={[
                {
                  name: 'Project Revenue',
                  data: futureValueData, //Replace this with actual data
                  type: 'line'
                },
                {
                  name: 'Cost',
                  data: costVal //Replace this with actual data
                }
              ]}
              sx={{ height: '900%' }}
            />
          </Grid>
          <Grid
            xs={12}
            md={12}
            lg={8}
          >
          </Grid>
        </Grid>
      </Container>
    </Box>
  </>
);
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
