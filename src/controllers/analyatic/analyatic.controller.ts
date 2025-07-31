import { Request, Response } from "express";
import catchAsync from "../../utils/catch.async";
import AnalyticsService, {
  OverviewStats,
  MonthlyData,
} from "../../service/analyatic/analyatic.service";

export const getAnalyticsOverview = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const overview: OverviewStats = await AnalyticsService.getOverview();
    res.status(200).json({
      success: true,
      data: overview,
    });
  }
);


export const getRevenueAnalytics = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const year = parseInt(req.query.year as string, 10) || new Date().getFullYear();
    const revenue: MonthlyData[] = await AnalyticsService.getMonthlyRevenue(year);
    res.status(200).json({
      success: true,
      data: revenue,
    });
  }
);


export const getMonthlySubscriptionsAnalytics = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const year = parseInt(req.query.year as string, 10) || new Date().getFullYear();
    const subscriptions: MonthlyData[] =
      await AnalyticsService.getMonthlySubscriptions(year);
    res.status(200).json({
      success: true,
      data: subscriptions,
    });
  }
);
