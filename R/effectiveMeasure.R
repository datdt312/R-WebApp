
library(sfa)
library(tidyverse)
library(readxl)

estimate_model <- function(filePath, dependentVar, independentVar) {
    
    idata = read_excel(filePath)
    
    dependentPart = str_c("log(", dependentVar, ")", collapse='')
    
    independentVar = str_split(independentVar, ',')[[1]]
    independentPart = str_c(str_c("log(", independentVar, ")"), collapse="+")
    
    iformula = paste(dependentPart, "~", independentPart, sep='')
    print(iformula)
    model = sfa(iformula, data = idata)
    coef(model, which = "ols")
    coef(model, which = "grid")
    coef(model)
    res = summary(model)
    return(res)
}

estimate_model("./temp/Table2_1.xls", "output", "labor,capital")