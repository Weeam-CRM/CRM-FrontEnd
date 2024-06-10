import { position } from "@chakra-ui/system";
import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";

const ApexChart = (props) => {
  const { leadData } = props;

  let newLength =
    leadData && leadData?.length && leadData?.length > 0
      ? leadData?.filter((lead) => lead?.leadStatus === "new" || lead?.leadStatus === "")?.length
      : 0;
  let activeLength =
    leadData && leadData?.length && leadData?.length > 0
      ? leadData?.filter((lead) => lead?.leadStatus === "active")?.length
      : 0;
  let pendingLength =
    leadData && leadData?.length && leadData?.length > 0
      ? leadData?.filter((lead) => lead?.leadStatus === "pending")?.length
      : 0;
  let soldLength =
    leadData && leadData?.length && leadData?.length > 0
      ? leadData?.filter((lead) => lead?.leadStatus === "sold")?.length
      : 0;
  let noAnswerLength =
    leadData && leadData?.length && leadData?.length > 0
      ? leadData?.filter((lead) => lead?.leadStatus === "no_answer")?.length
      : 0;
  let unreachableLength =
    leadData && leadData?.length && leadData?.length > 0
      ? leadData?.filter((lead) => lead?.leadStatus === "unreachable")?.length
      : 0;
  const series = [
    newLength,
    activeLength,
    pendingLength,
    soldLength,
    noAnswerLength,
    unreachableLength,
  ];
  const scaledSeries = series.map((value) =>
    leadData?.length ? (value * 100) / leadData?.length : 0
  );
  const options = {
    chart: {
      type: "pie",
      // height: 350,
      width: 330,
    },
    legend: {
      show: false, 
      floating: true, 
    },
    stroke: {
      lineCap: "round",
    },
    series: scaledSeries,
  
    labels: [
      "New",
      "Interested",
      "Not interested",
      "Sold",
      "No Answer",
      "Unreachable",
    ],
  };

  return (
    <div>
      <ReactApexChart
        options={options}
        type="pie"
        series={scaledSeries}
        height={320}
      />
    </div>
  );
};

export default ApexChart;
