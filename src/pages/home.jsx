import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PieChartWithCenterLabel from "@/components/ui/pie-chart";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AxiosGet } from "@/utils/axiosCaller";
import { useCookies } from "react-cookie";
import { badgeColorsHex, constants } from "@/utils/constants";
import { toast } from "@/hooks/use-toast";

export const Home = () => {
  //users data
  const [cookies] = useCookies([
    constants.COOKIES_KEY.AUTH_TOKEN,
    constants.COOKIES_KEY.USER_ID,
  ]);
  const token = cookies[constants.COOKIES_KEY.AUTH_TOKEN];
  const currentUserId = cookies[constants.COOKIES_KEY.USER_ID];

  const [pieChartsData, setPieChartsData] = useState([]);

  useEffect(() => {
    const fetchAnalytcisData = async () => {
      try {
        const apiName = "api/user/useranalytics";
        const response = await AxiosGet(
          apiName,
          { userId: currentUserId },
          token
        );
        setPieChartsData(
          response.data.data.map((item) => {
            return {
              title: item.title,
              description: item.description,
              data: item.data.map((dataItem) => {
                return {
                  id: dataItem.id,
                  value: dataItem.value,
                  label: (location) =>
                    location === "tooltip" ? (
                      <>
                        <div className="text-lg font-semibold">
                          <span className="text-gray-800">{dataItem.id}:</span>
                        </div>
                        <div className="space-y-2 mt-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">
                              Solved Problems:
                            </span>
                            <span className="text-sm font-semibold text-green-600">
                              {dataItem.label.solvedProblemsCount}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">
                              Unsolved Problems:
                            </span>
                            <span className="text-sm font-semibold text-red-600">
                              {dataItem.label.unsolvedProblemsCount}
                            </span>
                          </div>
                        </div>
                      </>
                    ) : (
                      ""
                    ),
                  color: badgeColorsHex[dataItem?.color],
                  tooltip: "none",
                };
              }),
              innerRadius: item.innerRadius,
            };
          })
        );
      } catch (error) {
        console.error("Error fetching data", error);
        toast({
          variant: "destructive",
          title:
            error?.response?.data?.message ||
            "Failed to fetch data. Please try again later",
        });
      }
    };

    fetchAnalytcisData();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
        {pieChartsData.map((item, index) => (
          <TooltipProvider key={index}>
            <Card className="w-full md:w-[350px] lg:w-[400px] xl:w-[450px] hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  {item.title}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {item.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="grid w-full items-center gap-4">
                  <div className="relative">
                    <PieChartWithCenterLabel
                      data={item.data}
                      innerRadius={item.innerRadius}
                      centreLabel="Solved Problems"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
};

export default Home;
