import { format } from "d3-format";

export const formatCount = (value) => format(".3s")(value).replace("k", "m");
