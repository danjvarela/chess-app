import Aurelia from "aurelia";
import { MyApp } from "./my-app";
import * as customAtttributes from "./resources/custom-attributes";
import "./tailwind.css";

Aurelia.register(customAtttributes).app(MyApp).start();
