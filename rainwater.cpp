#include <vector>
#include <iostream>
#include <string>
#include <map>
#include <stack>
#include <algorithm>
#include <cassert>
#include <utility>
using namespace std;
class Solution
{
public:
  pair<int, int> tallests(vector<int> &h, int start, int end)
  {
    pair<int, int> ret = {-1, -1};
    for (int i = start; i <= end; i++)
    {
      if (ret.first == -1)
      {
        ret.first = i;
      }
      else if (h[i] > h[ret.first])
      {
        ret.second = ret.first;
        ret.first = i;
      }
      else if (ret.second == -1 || h[i] > h[ret.second])
      {
        ret.second = i;
      }
    }
    if (ret.first > ret.second)
    {
      swap(ret.first, ret.second);
    }
    
    return ret;
  }

  int count(vector<int> &h, pair<int, int> &p)
  {
    int cnt = (h[p.first] > h[p.second] ? h[p.second] : h[p.first]) * (p.second - p.first - 1);
    for (int i = p.first + 1; i < p.second; i++)
    {
      cnt -= h[i];
    }
    return cnt;
  }
  int calc(vector<int> &h, int start, int end)
  {
    if (start == end || start + 1 == end)
      return 0;
    auto p = tallests(h, start, end);
    if(p.first == -1 || p.second == -1) return 0;
    int cnt = count(h, p);
    cnt += calc(h, start, p.first); // left
    cnt += calc(h, p.second, end);
    return cnt;
  }
  int trap(vector<int> &h)
  {
    return calc(h, 0, h.size() - 1);
  }
};

int main()
{
  vector<int> v = {0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1};
  cout << Solution().trap(v) << endl;
  return 0;
}

