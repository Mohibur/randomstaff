namespace math {
void powerset(int len) {
  std::map<unsigned int, unsigned int> powmap;
  for (int i = 0; i < len; i++)
  {
    powmap.insert({i, std::pow(2, i)});
  }
  unsigned int powerlen = std::pow(2, len);
  for (unsigned int i = 1; i <= powerlen; i++)
  {
    for (int j = 0; j < len; j++)
    {
      if (powmap[j] & i) 
        std::cout << j + 1 << " ";
      }
      std::cout << std::endl;
    }
  }
}
