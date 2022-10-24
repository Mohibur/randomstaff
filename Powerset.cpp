std::vector<std::vector<int>> process(int length)
  {
    std::vector<std::vector<int>> list;
    list.push_back(std::vector<int>());
    int index = 0;
    int nn = 0;
    while(true) {
      for(;nn<length;nn++) {
        list.push_back(std::vector<int>(list[index]));
        list[list.size()-1].push_back(nn);
      }
      index++;
      if (index >= list.size())
        break;
      nn = list[index][list[index].size() - 1] + 1;
    }
    return list;
  }
};
