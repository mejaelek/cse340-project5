// DO NOT MODIFY THIS FILE

using System;
using System.Collections.Generic;
using System.Diagnostics;

public static class Search
{
    /// <summary>
    /// Search for the item in a sorted list using a linear search.
    /// Performance: O(n)
    /// </summary>
    public static (int, long) SearchSorted1(List<int> sortedData, int target)
    {
        int count = 0;
        var sw = Stopwatch.StartNew();

        for (int i = 0; i < sortedData.Count; i++)
        {
            count++;
            if (sortedData[i] == target)
            {
                sw.Stop();
                return (count, sw.ElapsedMilliseconds);
            }
        }

        sw.Stop();
        return (count, sw.ElapsedMilliseconds);
    }

    /// <summary>
    /// Search for the item in a sorted list using a binary search.
    /// Performance: O(log n)
    /// </summary>
    public static (int, long) SearchSorted2(List<int> sortedData, int target)
    {
        int count = 0;
        var sw = Stopwatch.StartNew();

        int left = 0;
        int right = sortedData.Count - 1;

        while (left <= right)
        {
            count++;
            int mid = (left + right) / 2;

            if (sortedData[mid] == target)
            {
                sw.Stop();
                return (count, sw.ElapsedMilliseconds);
            }
            else if (sortedData[mid] < target)
            {
                left = mid + 1;
            }
            else
            {
                right = mid - 1;
            }
        }

        sw.Stop();
        return (count, sw.ElapsedMilliseconds);
    }

    /// <summary>
    /// Run performance tests comparing SearchSorted1 and SearchSorted2.
    /// </summary>
    public static void Run()
    {
        int[] sizes = { 100, 1_000, 10_000, 100_000, 1_000_000 };
        int iterations = 100;

        Console.WriteLine($"{"n",-12}{"sort1-count",-15}{"sort2-count",-15}{"sort1-time",-15}{"sort2-time",-15}");
        Console.WriteLine(new string('-', 70));

        foreach (int n in sizes)
        {
            var data = new List<int>();
            for (int i = 0; i < n; i++)
                data.Add(i * 2); // even numbers only

            int target = n * 2 + 1; // odd number — guaranteed not in list (worst case)

            long totalTime1 = 0, totalTime2 = 0;
            int count1 = 0, count2 = 0;

            for (int i = 0; i < iterations; i++)
            {
                var (c1, t1) = SearchSorted1(data, target);
                var (c2, t2) = SearchSorted2(data, target);
                count1 = c1;
                count2 = c2;
                totalTime1 += t1;
                totalTime2 += t2;
            }

            Console.WriteLine($"{n,-12}{count1,-15}{count2,-15}{totalTime1 / iterations,-15}{totalTime2 / iterations,-15}");
        }
    }
}