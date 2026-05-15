// DO NOT MODIFY THIS FILE

using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;

public static class StandardDeviation
{
    /// <summary>
    /// Calculate the standard deviation of a list of numbers.
    /// Implementation 1 — O(n)
    /// </summary>
    public static double StandardDeviation1(List<double> data)
    {
        // Calculate the mean first
        double sum = 0;
        foreach (var value in data)
        {
            sum += value;
        }
        double mean = sum / data.Count;

        // Calculate the variance
        double varianceSum = 0;
        foreach (var value in data)
        {
            varianceSum += Math.Pow(value - mean, 2);
        }
        double variance = varianceSum / data.Count;

        return Math.Sqrt(variance);
    }

    /// <summary>
    /// Calculate the standard deviation of a list of numbers.
    /// Implementation 2 — O(n^2)
    /// </summary>
    public static double StandardDeviation2(List<double> data)
    {
        double varianceSum = 0;
        for (int i = 0; i < data.Count; i++)
        {
            for (int j = 0; j < data.Count; j++)
            {
                varianceSum += Math.Pow(data[i] - data[j], 2);
            }
        }
        double variance = varianceSum / (2 * data.Count * data.Count);
        return Math.Sqrt(variance);
    }

    /// <summary>
    /// Calculate the standard deviation of a list of numbers.
    /// Implementation 3 — O(n log n)
    /// </summary>
    public static double StandardDeviation3(List<double> data)
    {
        // Sort the data first
        var sortedData = new List<double>(data);
        sortedData.Sort();

        double sum = 0;
        foreach (var value in sortedData)
        {
            sum += value;
        }
        double mean = sum / sortedData.Count;

        double varianceSum = 0;
        foreach (var value in sortedData)
        {
            varianceSum += Math.Pow(value - mean, 2);
        }
        double variance = varianceSum / sortedData.Count;

        return Math.Sqrt(variance);
    }
}