import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, z as getDefaultExportFromCjs, R as React2, A as useSearch, q as useNavigate, s as useGetVehicle, k as useAuth, D as useCreateBooking, E as usePolicies, F as useSubmitIDVerification, B as Button, L as Link, i as ue, P as PaymentMethod, G as LoaderCircle } from "./index-irnVJvcV.js";
import { C as Car, L as Label, I as Input } from "./label-D4xuO9sr.js";
import { M as MotionConfigContext, i as isHTMLElement, u as useConstant, P as PresenceContext, a as usePresence, b as useIsomorphicLayoutEffect, L as LayoutGroupContext, m as motion } from "./proxy-B7zvdM7E.js";
import { S as Shield } from "./shield-v2tpAXVL.js";
import { a as CircleCheckBig, C as CircleAlert } from "./circle-check-big-DOMqNcZN.js";
import { C as CreditCard } from "./credit-card-DkWzIIts.js";
import { C as Calendar } from "./calendar-BprvNXmT.js";
import { S as ShieldCheck, C as Copy } from "./shield-check-D7D7k1Zv.js";
import { P as Phone } from "./phone-ChmEem51.js";
import { A as ArrowLeft } from "./arrow-left-CfdV0Pwi.js";
import { B as Bitcoin } from "./bitcoin-DMFPQ8NC.js";
import { C as Clock } from "./clock-DZwx_36_.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const CircleCheck = createLucideIcon("circle-check", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "m9 15 2 2 4-4", key: "1grp1n" }]
];
const FileCheck = createLucideIcon("file-check", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ],
  ["path", { d: "M12 8v4", key: "1got3b" }],
  ["path", { d: "M12 16h.01", key: "1drbdi" }]
];
const ShieldAlert = createLucideIcon("shield-alert", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m16 11 2 2 4-4", key: "9rsbq5" }],
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
];
const UserCheck = createLucideIcon("user-check", __iconNode);
function setRef(ref, value) {
  if (typeof ref === "function") {
    return ref(value);
  } else if (ref !== null && ref !== void 0) {
    ref.current = value;
  }
}
function composeRefs(...refs) {
  return (node) => {
    let hasCleanup = false;
    const cleanups = refs.map((ref) => {
      const cleanup = setRef(ref, node);
      if (!hasCleanup && typeof cleanup === "function") {
        hasCleanup = true;
      }
      return cleanup;
    });
    if (hasCleanup) {
      return () => {
        for (let i = 0; i < cleanups.length; i++) {
          const cleanup = cleanups[i];
          if (typeof cleanup === "function") {
            cleanup();
          } else {
            setRef(refs[i], null);
          }
        }
      };
    }
  };
}
function useComposedRefs(...refs) {
  return reactExports.useCallback(composeRefs(...refs), refs);
}
class PopChildMeasure extends reactExports.Component {
  getSnapshotBeforeUpdate(prevProps) {
    const element = this.props.childRef.current;
    if (isHTMLElement(element) && prevProps.isPresent && !this.props.isPresent && this.props.pop !== false) {
      const parent = element.offsetParent;
      const parentWidth = isHTMLElement(parent) ? parent.offsetWidth || 0 : 0;
      const parentHeight = isHTMLElement(parent) ? parent.offsetHeight || 0 : 0;
      const computedStyle = getComputedStyle(element);
      const size = this.props.sizeRef.current;
      size.height = parseFloat(computedStyle.height);
      size.width = parseFloat(computedStyle.width);
      size.top = element.offsetTop;
      size.left = element.offsetLeft;
      size.right = parentWidth - size.width - size.left;
      size.bottom = parentHeight - size.height - size.top;
    }
    return null;
  }
  /**
   * Required with getSnapshotBeforeUpdate to stop React complaining.
   */
  componentDidUpdate() {
  }
  render() {
    return this.props.children;
  }
}
function PopChild({ children, isPresent, anchorX, anchorY, root, pop }) {
  var _a;
  const id = reactExports.useId();
  const ref = reactExports.useRef(null);
  const size = reactExports.useRef({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  });
  const { nonce } = reactExports.useContext(MotionConfigContext);
  const childRef = ((_a = children.props) == null ? void 0 : _a.ref) ?? (children == null ? void 0 : children.ref);
  const composedRef = useComposedRefs(ref, childRef);
  reactExports.useInsertionEffect(() => {
    const { width, height, top, left, right, bottom } = size.current;
    if (isPresent || pop === false || !ref.current || !width || !height)
      return;
    const x = anchorX === "left" ? `left: ${left}` : `right: ${right}`;
    const y = anchorY === "bottom" ? `bottom: ${bottom}` : `top: ${top}`;
    ref.current.dataset.motionPopId = id;
    const style = document.createElement("style");
    if (nonce)
      style.nonce = nonce;
    const parent = root ?? document.head;
    parent.appendChild(style);
    if (style.sheet) {
      style.sheet.insertRule(`
          [data-motion-pop-id="${id}"] {
            position: absolute !important;
            width: ${width}px !important;
            height: ${height}px !important;
            ${x}px !important;
            ${y}px !important;
          }
        `);
    }
    return () => {
      var _a2;
      (_a2 = ref.current) == null ? void 0 : _a2.removeAttribute("data-motion-pop-id");
      if (parent.contains(style)) {
        parent.removeChild(style);
      }
    };
  }, [isPresent]);
  return jsxRuntimeExports.jsx(PopChildMeasure, { isPresent, childRef: ref, sizeRef: size, pop, children: pop === false ? children : reactExports.cloneElement(children, { ref: composedRef }) });
}
const PresenceChild = ({ children, initial, isPresent, onExitComplete, custom, presenceAffectsLayout, mode, anchorX, anchorY, root }) => {
  const presenceChildren = useConstant(newChildrenMap);
  const id = reactExports.useId();
  let isReusedContext = true;
  let context = reactExports.useMemo(() => {
    isReusedContext = false;
    return {
      id,
      initial,
      isPresent,
      custom,
      onExitComplete: (childId) => {
        presenceChildren.set(childId, true);
        for (const isComplete of presenceChildren.values()) {
          if (!isComplete)
            return;
        }
        onExitComplete && onExitComplete();
      },
      register: (childId) => {
        presenceChildren.set(childId, false);
        return () => presenceChildren.delete(childId);
      }
    };
  }, [isPresent, presenceChildren, onExitComplete]);
  if (presenceAffectsLayout && isReusedContext) {
    context = { ...context };
  }
  reactExports.useMemo(() => {
    presenceChildren.forEach((_, key) => presenceChildren.set(key, false));
  }, [isPresent]);
  reactExports.useEffect(() => {
    !isPresent && !presenceChildren.size && onExitComplete && onExitComplete();
  }, [isPresent]);
  children = jsxRuntimeExports.jsx(PopChild, { pop: mode === "popLayout", isPresent, anchorX, anchorY, root, children });
  return jsxRuntimeExports.jsx(PresenceContext.Provider, { value: context, children });
};
function newChildrenMap() {
  return /* @__PURE__ */ new Map();
}
const getChildKey = (child) => child.key || "";
function onlyElements(children) {
  const filtered = [];
  reactExports.Children.forEach(children, (child) => {
    if (reactExports.isValidElement(child))
      filtered.push(child);
  });
  return filtered;
}
const AnimatePresence = ({ children, custom, initial = true, onExitComplete, presenceAffectsLayout = true, mode = "sync", propagate = false, anchorX = "left", anchorY = "top", root }) => {
  const [isParentPresent, safeToRemove] = usePresence(propagate);
  const presentChildren = reactExports.useMemo(() => onlyElements(children), [children]);
  const presentKeys = propagate && !isParentPresent ? [] : presentChildren.map(getChildKey);
  const isInitialRender = reactExports.useRef(true);
  const pendingPresentChildren = reactExports.useRef(presentChildren);
  const exitComplete = useConstant(() => /* @__PURE__ */ new Map());
  const exitingComponents = reactExports.useRef(/* @__PURE__ */ new Set());
  const [diffedChildren, setDiffedChildren] = reactExports.useState(presentChildren);
  const [renderedChildren, setRenderedChildren] = reactExports.useState(presentChildren);
  useIsomorphicLayoutEffect(() => {
    isInitialRender.current = false;
    pendingPresentChildren.current = presentChildren;
    for (let i = 0; i < renderedChildren.length; i++) {
      const key = getChildKey(renderedChildren[i]);
      if (!presentKeys.includes(key)) {
        if (exitComplete.get(key) !== true) {
          exitComplete.set(key, false);
        }
      } else {
        exitComplete.delete(key);
        exitingComponents.current.delete(key);
      }
    }
  }, [renderedChildren, presentKeys.length, presentKeys.join("-")]);
  const exitingChildren = [];
  if (presentChildren !== diffedChildren) {
    let nextChildren = [...presentChildren];
    for (let i = 0; i < renderedChildren.length; i++) {
      const child = renderedChildren[i];
      const key = getChildKey(child);
      if (!presentKeys.includes(key)) {
        nextChildren.splice(i, 0, child);
        exitingChildren.push(child);
      }
    }
    if (mode === "wait" && exitingChildren.length) {
      nextChildren = exitingChildren;
    }
    setRenderedChildren(onlyElements(nextChildren));
    setDiffedChildren(presentChildren);
    return null;
  }
  const { forceRender } = reactExports.useContext(LayoutGroupContext);
  return jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: renderedChildren.map((child) => {
    const key = getChildKey(child);
    const isPresent = propagate && !isParentPresent ? false : presentChildren === renderedChildren || presentKeys.includes(key);
    const onExit = () => {
      if (exitingComponents.current.has(key)) {
        return;
      }
      if (exitComplete.has(key)) {
        exitingComponents.current.add(key);
        exitComplete.set(key, true);
      } else {
        return;
      }
      let isEveryExitComplete = true;
      exitComplete.forEach((isExitComplete) => {
        if (!isExitComplete)
          isEveryExitComplete = false;
      });
      if (isEveryExitComplete) {
        forceRender == null ? void 0 : forceRender();
        setRenderedChildren(pendingPresentChildren.current);
        propagate && (safeToRemove == null ? void 0 : safeToRemove());
        onExitComplete && onExitComplete();
      }
    };
    return jsxRuntimeExports.jsx(PresenceChild, { isPresent, initial: !isInitialRender.current || initial ? void 0 : false, custom, presenceAffectsLayout, mode, root, onExitComplete: isPresent ? void 0 : onExit, anchorX, anchorY, children: child }, key);
  }) });
};
var propTypes = { exports: {} };
var ReactPropTypesSecret$1 = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";
var ReactPropTypesSecret_1 = ReactPropTypesSecret$1;
var ReactPropTypesSecret = ReactPropTypesSecret_1;
function emptyFunction() {
}
function emptyFunctionWithReset() {
}
emptyFunctionWithReset.resetWarningCache = emptyFunction;
var factoryWithThrowingShims = function() {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret) {
      return;
    }
    var err = new Error(
      "Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types"
    );
    err.name = "Invariant Violation";
    throw err;
  }
  shim.isRequired = shim;
  function getShim() {
    return shim;
  }
  var ReactPropTypes = {
    array: shim,
    bigint: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,
    any: shim,
    arrayOf: getShim,
    element: shim,
    elementType: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim,
    exact: getShim,
    checkPropTypes: emptyFunctionWithReset,
    resetWarningCache: emptyFunction
  };
  ReactPropTypes.PropTypes = ReactPropTypes;
  return ReactPropTypes;
};
{
  propTypes.exports = factoryWithThrowingShims();
}
var propTypesExports = propTypes.exports;
const PropTypes = /* @__PURE__ */ getDefaultExportFromCjs(propTypesExports);
function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) {
      symbols = symbols.filter(function(sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }
    keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys(Object(source), true).forEach(function(key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function(key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }
  return target;
}
function _typeof$1(obj) {
  "@babel/helpers - typeof";
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof$1 = function(obj2) {
      return typeof obj2;
    };
  } else {
    _typeof$1 = function(obj2) {
      return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
    };
  }
  return _typeof$1(obj);
}
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}
function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = _objectWithoutPropertiesLoose(source, excluded);
  var key, i;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }
  return target;
}
function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}
function _iterableToArrayLimit(arr, i) {
  var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]);
  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _s, _e;
  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);
      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }
  return _arr;
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
var useAttachEvent = function useAttachEvent2(element, event, cb) {
  var cbDefined = !!cb;
  var cbRef = React2.useRef(cb);
  React2.useEffect(function() {
    cbRef.current = cb;
  }, [cb]);
  React2.useEffect(function() {
    if (!cbDefined || !element) {
      return function() {
      };
    }
    var decoratedCb = function decoratedCb2() {
      if (cbRef.current) {
        cbRef.current.apply(cbRef, arguments);
      }
    };
    element.on(event, decoratedCb);
    return function() {
      element.off(event, decoratedCb);
    };
  }, [cbDefined, event, element, cbRef]);
};
var usePrevious = function usePrevious2(value) {
  var ref = React2.useRef(value);
  React2.useEffect(function() {
    ref.current = value;
  }, [value]);
  return ref.current;
};
var isUnknownObject = function isUnknownObject2(raw) {
  return raw !== null && _typeof$1(raw) === "object";
};
var isPromise = function isPromise2(raw) {
  return isUnknownObject(raw) && typeof raw.then === "function";
};
var isStripe = function isStripe2(raw) {
  return isUnknownObject(raw) && typeof raw.elements === "function" && typeof raw.createToken === "function" && typeof raw.createPaymentMethod === "function" && typeof raw.confirmCardPayment === "function";
};
var PLAIN_OBJECT_STR = "[object Object]";
var isEqual = function isEqual2(left, right) {
  if (!isUnknownObject(left) || !isUnknownObject(right)) {
    return left === right;
  }
  var leftArray = Array.isArray(left);
  var rightArray = Array.isArray(right);
  if (leftArray !== rightArray) return false;
  var leftPlainObject = Object.prototype.toString.call(left) === PLAIN_OBJECT_STR;
  var rightPlainObject = Object.prototype.toString.call(right) === PLAIN_OBJECT_STR;
  if (leftPlainObject !== rightPlainObject) return false;
  if (!leftPlainObject && !leftArray) return left === right;
  var leftKeys = Object.keys(left);
  var rightKeys = Object.keys(right);
  if (leftKeys.length !== rightKeys.length) return false;
  var keySet = {};
  for (var i = 0; i < leftKeys.length; i += 1) {
    keySet[leftKeys[i]] = true;
  }
  for (var _i = 0; _i < rightKeys.length; _i += 1) {
    keySet[rightKeys[_i]] = true;
  }
  var allKeys = Object.keys(keySet);
  if (allKeys.length !== leftKeys.length) {
    return false;
  }
  var l = left;
  var r = right;
  var pred = function pred2(key) {
    return isEqual2(l[key], r[key]);
  };
  return allKeys.every(pred);
};
var extractAllowedOptionsUpdates = function extractAllowedOptionsUpdates2(options, prevOptions, immutableKeys) {
  if (!isUnknownObject(options)) {
    return null;
  }
  return Object.keys(options).reduce(function(newOptions, key) {
    var isUpdated = !isUnknownObject(prevOptions) || !isEqual(options[key], prevOptions[key]);
    if (immutableKeys.includes(key)) {
      if (isUpdated) {
        console.warn("Unsupported prop change: options.".concat(key, " is not a mutable property."));
      }
      return newOptions;
    }
    if (!isUpdated) {
      return newOptions;
    }
    return _objectSpread2(_objectSpread2({}, newOptions || {}), {}, _defineProperty({}, key, options[key]));
  }, null);
};
var INVALID_STRIPE_ERROR$1 = "Invalid prop `stripe` supplied to `Elements`. We recommend using the `loadStripe` utility from `@stripe/stripe-js`. See https://stripe.com/docs/stripe-js/react#elements-props-stripe for details.";
var validateStripe = function validateStripe2(maybeStripe) {
  var errorMsg = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : INVALID_STRIPE_ERROR$1;
  if (maybeStripe === null || isStripe(maybeStripe)) {
    return maybeStripe;
  }
  throw new Error(errorMsg);
};
var parseStripeProp = function parseStripeProp2(raw) {
  var errorMsg = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : INVALID_STRIPE_ERROR$1;
  if (isPromise(raw)) {
    return {
      tag: "async",
      stripePromise: Promise.resolve(raw).then(function(result) {
        return validateStripe(result, errorMsg);
      })
    };
  }
  var stripe = validateStripe(raw, errorMsg);
  if (stripe === null) {
    return {
      tag: "empty"
    };
  }
  return {
    tag: "sync",
    stripe
  };
};
var registerWithStripeJs = function registerWithStripeJs2(stripe) {
  if (!stripe || !stripe._registerWrapper || !stripe.registerAppInfo) {
    return;
  }
  stripe._registerWrapper({
    name: "react-stripe-js",
    version: "6.4.0"
  });
  stripe.registerAppInfo({
    name: "react-stripe-js",
    version: "6.4.0",
    url: "https://stripe.com/docs/stripe-js/react"
  });
};
var ElementsContext = /* @__PURE__ */ React2.createContext(null);
ElementsContext.displayName = "ElementsContext";
var parseElementsContext = function parseElementsContext2(ctx, useCase) {
  if (!ctx) {
    throw new Error("Could not find Elements context; You need to wrap the part of your app that ".concat(useCase, " in an <Elements> provider."));
  }
  return ctx;
};
var Elements = function Elements2(_ref) {
  var rawStripeProp = _ref.stripe, options = _ref.options, children = _ref.children;
  var parsed = React2.useMemo(function() {
    return parseStripeProp(rawStripeProp);
  }, [rawStripeProp]);
  var _React$useState = React2.useState(function() {
    return {
      stripe: parsed.tag === "sync" ? parsed.stripe : null,
      elements: parsed.tag === "sync" ? parsed.stripe.elements(options) : null
    };
  }), _React$useState2 = _slicedToArray(_React$useState, 2), ctx = _React$useState2[0], setContext = _React$useState2[1];
  React2.useEffect(function() {
    var isMounted = true;
    var safeSetContext = function safeSetContext2(stripe) {
      setContext(function(ctx2) {
        if (ctx2.stripe) return ctx2;
        return {
          stripe,
          elements: stripe.elements(options)
        };
      });
    };
    if (parsed.tag === "async" && !ctx.stripe) {
      parsed.stripePromise.then(function(stripe) {
        if (stripe && isMounted) {
          safeSetContext(stripe);
        }
      });
    } else if (parsed.tag === "sync" && !ctx.stripe) {
      safeSetContext(parsed.stripe);
    }
    return function() {
      isMounted = false;
    };
  }, [parsed, ctx, options]);
  var prevStripe = usePrevious(rawStripeProp);
  React2.useEffect(function() {
    if (prevStripe !== null && prevStripe !== rawStripeProp) {
      console.warn("Unsupported prop change on Elements: You cannot change the `stripe` prop after setting it.");
    }
  }, [prevStripe, rawStripeProp]);
  var prevOptions = usePrevious(options);
  React2.useEffect(function() {
    if (!ctx.elements) {
      return;
    }
    var updates = extractAllowedOptionsUpdates(options, prevOptions, ["clientSecret", "fonts"]);
    if (updates) {
      ctx.elements.update(updates);
    }
  }, [options, prevOptions, ctx.elements]);
  React2.useEffect(function() {
    registerWithStripeJs(ctx.stripe);
  }, [ctx.stripe]);
  return /* @__PURE__ */ React2.createElement(ElementsContext.Provider, {
    value: ctx
  }, children);
};
Elements.propTypes = {
  stripe: PropTypes.any,
  options: PropTypes.object
};
var useElementsContextWithUseCase = function useElementsContextWithUseCase2(useCaseMessage) {
  var ctx = React2.useContext(ElementsContext);
  return parseElementsContext(ctx, useCaseMessage);
};
var useElements = function useElements2() {
  var _useElementsContextWi = useElementsContextWithUseCase("calls useElements()"), elements = _useElementsContextWi.elements;
  return elements;
};
({
  children: PropTypes.func.isRequired
});
var CheckoutContext = /* @__PURE__ */ React2.createContext(null);
CheckoutContext.displayName = "CheckoutContext";
var useElementsOrCheckoutContextWithUseCase = function useElementsOrCheckoutContextWithUseCase2(useCaseString) {
  var checkout = React2.useContext(CheckoutContext);
  var elements = React2.useContext(ElementsContext);
  if (checkout) {
    if (elements) {
      throw new Error("You cannot wrap the part of your app that ".concat(useCaseString, " in both a checkout provider and <Elements> provider."));
    } else {
      return checkout;
    }
  } else {
    return parseElementsContext(elements, useCaseString);
  }
};
var _excluded = ["mode"];
var capitalized = function capitalized2(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
var createElementComponent = function createElementComponent2(type, isServer2, customDisplayName) {
  var displayName = "".concat(capitalized(type), "Element");
  var ClientElement = function ClientElement2(_ref) {
    var id = _ref.id, className = _ref.className, _ref$options = _ref.options, options = _ref$options === void 0 ? {} : _ref$options, onBlur = _ref.onBlur, onFocus = _ref.onFocus, onReady = _ref.onReady, onChange = _ref.onChange, onEscape = _ref.onEscape, onClick = _ref.onClick, onLoadError = _ref.onLoadError, onLoaderStart = _ref.onLoaderStart, onNetworksChange = _ref.onNetworksChange, onConfirm = _ref.onConfirm, onCancel = _ref.onCancel, onShippingAddressChange = _ref.onShippingAddressChange, onShippingRateChange = _ref.onShippingRateChange, onSavedPaymentMethodRemove = _ref.onSavedPaymentMethodRemove, onSavedPaymentMethodUpdate = _ref.onSavedPaymentMethodUpdate, onAvailablePaymentMethodsChange = _ref.onAvailablePaymentMethodsChange;
    var ctx = useElementsOrCheckoutContextWithUseCase("mounts <".concat(displayName, ">"));
    var elements = "elements" in ctx ? ctx.elements : null;
    var checkoutState = "checkoutState" in ctx ? ctx.checkoutState : null;
    var checkoutSdk = (checkoutState === null || checkoutState === void 0 ? void 0 : checkoutState.type) === "success" || (checkoutState === null || checkoutState === void 0 ? void 0 : checkoutState.type) === "loading" ? checkoutState.sdk : null;
    var _React$useState = React2.useState(null), _React$useState2 = _slicedToArray(_React$useState, 2), element = _React$useState2[0], setElement = _React$useState2[1];
    var elementRef = React2.useRef(null);
    var domNode = React2.useRef(null);
    useAttachEvent(element, "blur", onBlur);
    useAttachEvent(element, "focus", onFocus);
    useAttachEvent(element, "escape", onEscape);
    useAttachEvent(element, "click", onClick);
    useAttachEvent(element, "loaderror", onLoadError);
    useAttachEvent(element, "loaderstart", onLoaderStart);
    useAttachEvent(element, "networkschange", onNetworksChange);
    useAttachEvent(element, "confirm", onConfirm);
    useAttachEvent(element, "cancel", onCancel);
    useAttachEvent(element, "shippingaddresschange", onShippingAddressChange);
    useAttachEvent(element, "shippingratechange", onShippingRateChange);
    useAttachEvent(element, "savedpaymentmethodremove", onSavedPaymentMethodRemove);
    useAttachEvent(element, "savedpaymentmethodupdate", onSavedPaymentMethodUpdate);
    useAttachEvent(element, "availablepaymentmethodschange", onAvailablePaymentMethodsChange);
    useAttachEvent(element, "change", onChange);
    var readyCallback;
    if (onReady) {
      if (type === "expressCheckout") {
        readyCallback = onReady;
      } else {
        readyCallback = function readyCallback2() {
          onReady(element);
        };
      }
    }
    useAttachEvent(element, "ready", readyCallback);
    React2.useLayoutEffect(function() {
      if (elementRef.current === null && domNode.current !== null && (elements || checkoutSdk)) {
        var newElement = null;
        if (checkoutSdk) {
          var elementsSdk = checkoutSdk;
          var formSdk = checkoutSdk;
          switch (type) {
            case "paymentForm":
              newElement = formSdk.createForm(options);
              break;
            case "payment":
              newElement = elementsSdk.createPaymentElement(options);
              break;
            case "address":
              if ("mode" in options) {
                var mode = options.mode, restOptions = _objectWithoutProperties(options, _excluded);
                if (mode === "shipping") {
                  newElement = elementsSdk.createShippingAddressElement(restOptions);
                } else if (mode === "billing") {
                  newElement = elementsSdk.createBillingAddressElement(restOptions);
                } else {
                  throw new Error("Invalid options.mode. mode must be 'billing' or 'shipping'.");
                }
              } else {
                throw new Error("You must supply options.mode. mode must be 'billing' or 'shipping'.");
              }
              break;
            case "expressCheckout":
              newElement = elementsSdk.createExpressCheckoutElement(options);
              break;
            case "currencySelector":
              newElement = checkoutSdk.createCurrencySelectorElement();
              break;
            case "taxId":
              newElement = elementsSdk.createTaxIdElement(options);
              break;
            case "contactDetails":
              newElement = elementsSdk.createContactDetailsElement();
              break;
            default:
              throw new Error("<".concat(displayName, "> is not supported inside a checkout provider. Use an <Elements> provider instead."));
          }
        } else if (elements) {
          newElement = elements.create(type, options);
        }
        elementRef.current = newElement;
        setElement(newElement);
        if (newElement) {
          newElement.mount(domNode.current);
        }
      }
    }, [elements, checkoutSdk, options]);
    var prevOptions = usePrevious(options);
    React2.useEffect(function() {
      if (!elementRef.current) {
        return;
      }
      var updates = extractAllowedOptionsUpdates(options, prevOptions, ["paymentRequest"]);
      if (updates && "update" in elementRef.current) {
        elementRef.current.update(updates);
      }
    }, [options, prevOptions]);
    React2.useLayoutEffect(function() {
      return function() {
        if (elementRef.current && typeof elementRef.current.destroy === "function") {
          try {
            elementRef.current.destroy();
            elementRef.current = null;
          } catch (error) {
          }
        }
      };
    }, []);
    return /* @__PURE__ */ React2.createElement("div", {
      id,
      className,
      ref: domNode
    });
  };
  var ServerElement = function ServerElement2(props) {
    useElementsOrCheckoutContextWithUseCase("mounts <".concat(displayName, ">"));
    var id = props.id, className = props.className;
    return /* @__PURE__ */ React2.createElement("div", {
      id,
      className
    });
  };
  var Element = isServer2 ? ServerElement : ClientElement;
  Element.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    onReady: PropTypes.func,
    onEscape: PropTypes.func,
    onClick: PropTypes.func,
    onLoadError: PropTypes.func,
    onLoaderStart: PropTypes.func,
    onNetworksChange: PropTypes.func,
    onConfirm: PropTypes.func,
    onCancel: PropTypes.func,
    onShippingAddressChange: PropTypes.func,
    onShippingRateChange: PropTypes.func,
    onSavedPaymentMethodRemove: PropTypes.func,
    onSavedPaymentMethodUpdate: PropTypes.func,
    onAvailablePaymentMethodsChange: PropTypes.func,
    options: PropTypes.object
  };
  Element.displayName = displayName;
  Element.__elementType = type;
  return Element;
};
var isServer = typeof window === "undefined";
var EmbeddedCheckoutContext = /* @__PURE__ */ React2.createContext(null);
EmbeddedCheckoutContext.displayName = "EmbeddedCheckoutProviderContext";
var useStripe = function useStripe2() {
  var _useElementsOrCheckou = useElementsOrCheckoutContextWithUseCase("calls useStripe()"), stripe = _useElementsOrCheckou.stripe;
  return stripe;
};
createElementComponent("auBankAccount", isServer);
var CardElement = createElementComponent("card", isServer);
createElementComponent("cardNumber", isServer);
createElementComponent("cardExpiry", isServer);
createElementComponent("cardCvc", isServer);
createElementComponent("iban", isServer);
createElementComponent("payment", isServer);
createElementComponent("expressCheckout", isServer);
createElementComponent("paymentRequestButton", isServer);
createElementComponent("linkAuthentication", isServer);
createElementComponent("contactDetails", isServer);
createElementComponent("address", isServer);
createElementComponent("shippingAddress", isServer);
createElementComponent("paymentMethodMessaging", isServer);
createElementComponent("taxId", isServer);
createElementComponent("issuingCardNumberDisplay", isServer);
createElementComponent("issuingCardCvcDisplay", isServer);
createElementComponent("issuingCardExpiryDisplay", isServer);
createElementComponent("issuingCardPinDisplay", isServer);
createElementComponent("issuingCardCopyButton", isServer);
function _typeof(obj) {
  "@babel/helpers - typeof";
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function(obj2) {
      return typeof obj2;
    };
  } else {
    _typeof = function(obj2) {
      return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
    };
  }
  return _typeof(obj);
}
var RELEASE_TRAIN = "dahlia";
var runtimeVersionToUrlVersion = function runtimeVersionToUrlVersion2(version) {
  return version === 3 ? "v3" : version;
};
var ORIGIN = "https://js.stripe.com";
var STRIPE_JS_URL = "".concat(ORIGIN, "/").concat(RELEASE_TRAIN, "/stripe.js");
var V3_URL_REGEX = /^https:\/\/js\.stripe\.com\/v3\/?(\?.*)?$/;
var STRIPE_JS_URL_REGEX = /^https:\/\/js\.stripe\.com\/(v3|[a-z]+)\/stripe\.js(\?.*)?$/;
var EXISTING_SCRIPT_MESSAGE = "loadStripe.setLoadParameters was called but an existing Stripe.js script already exists in the document; existing script parameters will be used";
var isStripeJSURL = function isStripeJSURL2(url) {
  return V3_URL_REGEX.test(url) || STRIPE_JS_URL_REGEX.test(url);
};
var findScript = function findScript2() {
  var scripts = document.querySelectorAll('script[src^="'.concat(ORIGIN, '"]'));
  for (var i = 0; i < scripts.length; i++) {
    var script = scripts[i];
    if (!isStripeJSURL(script.src)) {
      continue;
    }
    return script;
  }
  return null;
};
var injectScript = function injectScript2(params) {
  var queryString = "";
  var script = document.createElement("script");
  script.src = "".concat(STRIPE_JS_URL).concat(queryString);
  var headOrBody = document.head || document.body;
  if (!headOrBody) {
    throw new Error("Expected document.body not to be null. Stripe.js requires a <body> element.");
  }
  headOrBody.appendChild(script);
  return script;
};
var registerWrapper = function registerWrapper2(stripe, startTime) {
  if (!stripe || !stripe._registerWrapper) {
    return;
  }
  stripe._registerWrapper({
    name: "stripe-js",
    version: "9.6.0",
    startTime
  });
};
var stripePromise$1 = null;
var onErrorListener = null;
var onLoadListener = null;
var onError = function onError2(reject) {
  return function(cause) {
    reject(new Error("Failed to load Stripe.js", {
      cause
    }));
  };
};
var onLoad = function onLoad2(resolve, reject) {
  return function() {
    if (window.Stripe) {
      resolve(window.Stripe);
    } else {
      reject(new Error("Stripe.js not available"));
    }
  };
};
var loadScript = function loadScript2(params) {
  if (stripePromise$1 !== null) {
    return stripePromise$1;
  }
  stripePromise$1 = new Promise(function(resolve, reject) {
    if (typeof window === "undefined" || typeof document === "undefined") {
      resolve(null);
      return;
    }
    if (window.Stripe) {
      resolve(window.Stripe);
      return;
    }
    try {
      var script = findScript();
      if (script && params) ;
      else if (!script) {
        script = injectScript(params);
      } else if (script && onLoadListener !== null && onErrorListener !== null) {
        var _script$parentNode;
        script.removeEventListener("load", onLoadListener);
        script.removeEventListener("error", onErrorListener);
        (_script$parentNode = script.parentNode) === null || _script$parentNode === void 0 ? void 0 : _script$parentNode.removeChild(script);
        script = injectScript(params);
      }
      onLoadListener = onLoad(resolve, reject);
      onErrorListener = onError(reject);
      script.addEventListener("load", onLoadListener);
      script.addEventListener("error", onErrorListener);
    } catch (error) {
      reject(error);
      return;
    }
  });
  return stripePromise$1["catch"](function(error) {
    stripePromise$1 = null;
    return Promise.reject(error);
  });
};
var initStripe = function initStripe2(maybeStripe, args, startTime) {
  if (maybeStripe === null) {
    return null;
  }
  var pk = args[0];
  if (typeof pk !== "string") {
    throw new Error("Expected publishable key to be of type string, got type ".concat(_typeof(pk), " instead."));
  }
  var isTestKey = pk.match(/^pk_test/);
  var version = runtimeVersionToUrlVersion(maybeStripe.version);
  var expectedVersion = RELEASE_TRAIN;
  if (isTestKey && version !== expectedVersion) {
    console.warn("Stripe.js@".concat(version, " was loaded on the page, but @stripe/stripe-js@").concat("9.6.0", " expected Stripe.js@").concat(expectedVersion, ". This may result in unexpected behavior. For more information, see https://docs.stripe.com/sdks/stripejs-versioning"));
  }
  var stripe = maybeStripe.apply(void 0, args);
  registerWrapper(stripe, startTime);
  return stripe;
};
var stripePromise$2;
var loadCalled = false;
var getStripePromise = function getStripePromise2() {
  if (stripePromise$2) {
    return stripePromise$2;
  }
  stripePromise$2 = loadScript(null)["catch"](function(error) {
    stripePromise$2 = null;
    return Promise.reject(error);
  });
  return stripePromise$2;
};
Promise.resolve().then(function() {
  return getStripePromise();
})["catch"](function(error) {
  if (!loadCalled) {
    console.warn(error);
  }
});
var loadStripe = function loadStripe2() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }
  loadCalled = true;
  var startTime = Date.now();
  return getStripePromise().then(function(maybeStripe) {
    return initStripe(maybeStripe, args, startTime);
  });
};
const stripePromise = loadStripe(
  ""
);
function formatUSD(n) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(n);
}
function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}
function CryptoSection({
  txHash,
  setTxHash,
  onSubmit,
  isPending
}) {
  function copyToClipboard(text, label) {
    navigator.clipboard.writeText(text).then(() => ue.success(`${label} copied!`));
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xs font-semibold uppercase tracking-[0.25em] text-primary mb-5", children: "Send Payment to Wallet" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-secondary border border-border rounded-lg p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-5 h-5 rounded-full bg-[#F7931A] flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bitcoin, { className: "w-3 h-3 text-white" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold uppercase tracking-widest text-foreground", children: "Bitcoin (BTC)" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "flex-1 text-xs text-muted-foreground font-mono break-all", children: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => copyToClipboard(
                  "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
                  "BTC address"
                ),
                className: "flex-shrink-0 p-1.5 rounded hover:bg-primary/10 transition-colors",
                "data-ocid": "checkout.copy_btc_button",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-3.5 h-3.5 text-muted-foreground" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-secondary border border-border rounded-lg p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-5 h-5 rounded-full bg-[#627EEA] flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white text-[10px] font-bold", children: "Ξ" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold uppercase tracking-widest text-foreground", children: "Ethereum (ETH)" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "flex-1 text-xs text-muted-foreground font-mono break-all", children: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => copyToClipboard(
                  "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
                  "ETH address"
                ),
                className: "flex-shrink-0 p-1.5 rounded hover:bg-primary/10 transition-colors",
                "data-ocid": "checkout.copy_eth_button",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-3.5 h-3.5 text-muted-foreground" })
              }
            )
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "block text-xs uppercase tracking-widest text-muted-foreground mb-3", children: "Transaction Hash / ID" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          placeholder: "Paste your transaction hash here",
          value: txHash,
          onChange: (e) => setTxHash(e.target.value),
          className: "font-mono text-sm mb-4",
          "data-ocid": "checkout.tx_hash_input"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "button",
          onClick: onSubmit,
          disabled: isPending || !txHash.trim(),
          className: "w-full bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-[0.2em] font-bold text-xs h-12",
          "data-ocid": "checkout.crypto_submit_button",
          children: isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }),
            "Processing..."
          ] }) : "Confirm Crypto Payment"
        }
      )
    ] })
  ] });
}
function CreditCardSectionInner({
  onPaySuccess,
  onPayError,
  isPending,
  grandTotal
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [stripeLoading, setStripeLoading] = reactExports.useState(false);
  const [stripeError, setStripeError] = reactExports.useState(null);
  const [cardReady, setCardReady] = reactExports.useState(false);
  const isProcessing = isPending || stripeLoading;
  async function handlePay() {
    if (!stripe || !elements) {
      onPayError("Payment system not loaded. Please refresh and try again.");
      return;
    }
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      onPayError("Card element not found. Please refresh and try again.");
      return;
    }
    setStripeLoading(true);
    setStripeError(null);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement
    });
    setStripeLoading(false);
    if (error) {
      const msg = error.message ?? "Card validation failed. Please check your card details.";
      setStripeError(msg);
      onPayError(msg);
      return;
    }
    if (!(paymentMethod == null ? void 0 : paymentMethod.id)) {
      const msg = "Could not create payment method. Please try again.";
      setStripeError(msg);
      onPayError(msg);
      return;
    }
    onPaySuccess(paymentMethod.id);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-6 space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xs font-semibold uppercase tracking-[0.25em] text-primary", children: "Card Details" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 bg-secondary border border-border rounded px-2 py-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-3 h-3 text-primary/70" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold text-muted-foreground", children: "Secured by Stripe" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-[#1434CB] rounded px-2 py-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-white text-xs tracking-wider", children: "VISA" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-9 h-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-0 w-5 h-5 rounded-full bg-[#EB001B] opacity-90" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-2 w-5 h-5 rounded-full bg-[#F79E1B] opacity-90" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-[#2E77BC] rounded px-2 py-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-white text-xs", children: "AMEX" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-1 bg-secondary border border-border rounded px-1.5 py-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-muted-foreground text-[10px]", children: "MC" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs uppercase tracking-widest text-muted-foreground", children: "Card Information" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "rounded-md border border-input bg-background px-3 py-3 focus-within:ring-1 focus-within:ring-primary/60 transition-all duration-200",
          "data-ocid": "checkout.stripe_card_element",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            CardElement,
            {
              options: {
                style: {
                  base: {
                    fontSize: "15px",
                    color: "#f0e6c8",
                    fontFamily: "inherit",
                    "::placeholder": {
                      color: "#6b6450"
                    },
                    iconColor: "#c9a84c"
                  },
                  invalid: {
                    color: "#f87171",
                    iconColor: "#f87171"
                  }
                },
                hidePostalCode: false
              },
              onChange: (e) => {
                var _a;
                setCardReady(e.complete);
                setStripeError(((_a = e.error) == null ? void 0 : _a.message) ?? null);
              }
            }
          )
        }
      ),
      stripeError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.p,
        {
          initial: { opacity: 0, y: -4 },
          animate: { opacity: 1, y: 0 },
          className: "text-xs text-destructive flex items-center gap-1.5",
          "data-ocid": "checkout.stripe_error_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-3.5 h-3.5 flex-shrink-0" }),
            stripeError
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        type: "button",
        onClick: handlePay,
        disabled: isProcessing || !stripe || !cardReady,
        className: "w-full bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-[0.2em] font-bold text-xs h-12 shadow-lg",
        "data-ocid": "checkout.pay_now_button",
        children: isProcessing ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }),
          stripeLoading ? "Validating Card..." : "Processing Booking..."
        ] }) : `Pay Now — ${formatUSD(grandTotal)}`
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-center text-muted-foreground", children: [
      "Your card information is encrypted and secure. Powered by",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary/80 font-medium", children: "Stripe" }),
      "."
    ] })
  ] });
}
function CreditCardSection({
  onPaySuccess,
  onPayError,
  isPending,
  grandTotal
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Elements, { stripe: stripePromise, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    CreditCardSectionInner,
    {
      onPaySuccess,
      onPayError,
      isPending,
      grandTotal
    }
  ) });
}
function CheckoutPage() {
  const search = useSearch({ strict: false });
  const navigate = useNavigate();
  const vehicleId = (search == null ? void 0 : search.vehicleId) ? BigInt(search.vehicleId) : null;
  const startDate = (search == null ? void 0 : search.startDate) ?? "";
  const endDate = (search == null ? void 0 : search.endDate) ?? "";
  const { data: vehicle } = useGetVehicle(vehicleId);
  const { isAuthenticated, login } = useAuth();
  const { mutate: createBooking, isPending } = useCreateBooking();
  const [step, setStep] = reactExports.useState("select");
  const [txHash, setTxHash] = reactExports.useState("");
  const [bookingState, setBookingState] = reactExports.useState({
    status: "idle"
  });
  const [waiverAgreed, setWaiverAgreed] = reactExports.useState(false);
  const [waiverSignedName, setWaiverSignedName] = reactExports.useState("");
  const [licensePhotoId, setLicensePhotoId] = reactExports.useState("");
  const [ssnLast4, setSsnLast4] = reactExports.useState("");
  const [idSubmitted, setIdSubmitted] = reactExports.useState(false);
  const { data: policies } = usePolicies();
  const { mutate: submitIDVerification } = useSubmitIDVerification();
  const days = startDate && endDate ? Math.max(
    1,
    Math.ceil(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) / 864e5
    )
  ) : 0;
  const dailyRate = vehicle ? Number(vehicle.dailyRate) : 0;
  const subtotal = dailyRate * days;
  const deposit = vehicle ? Number(vehicle.deposit) : 0;
  const grandTotal = subtotal + deposit;
  function doCreateBooking(method, extraOpts = {}) {
    if (!vehicle || !startDate || !endDate) return;
    createBooking(
      {
        vehicleId: vehicle.id,
        startDate: BigInt(new Date(startDate).getTime()),
        endDate: BigInt(new Date(endDate).getTime()),
        paymentMethod: method,
        ...extraOpts
      },
      {
        onSuccess: (booking) => {
          setBookingState({ status: "success", booking });
          if (licensePhotoId && ssnLast4) {
            submitIDVerification(
              {
                bookingId: booking.id.toString(),
                licensePhotoId,
                ssnLast4
              },
              {
                onSuccess: () => setIdSubmitted(true),
                onError: () => setIdSubmitted(false)
              }
            );
          }
          setStep("select");
        },
        onError: (err) => {
          setBookingState({
            status: "error",
            message: err.message || "Something went wrong. Please try again."
          });
        }
      }
    );
  }
  if (!isAuthenticated) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0 },
        className: "min-h-[70vh] flex items-center justify-center",
        "data-ocid": "checkout.auth_required",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center max-w-sm px-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-7 h-7 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-bold text-foreground mb-3", children: "Members Only" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm leading-relaxed mb-8", children: "Please sign in to complete your reservation with OK RENTALS." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: login,
              className: "w-full bg-primary text-primary-foreground uppercase tracking-[0.2em] font-semibold",
              "data-ocid": "checkout.login_button",
              children: "Sign In to Continue"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: "/cars",
              className: "block mt-4 text-sm text-muted-foreground hover:text-primary transition-colors duration-200",
              "data-ocid": "checkout.browse_fleet_link",
              children: "← Browse Fleet"
            }
          )
        ] })
      }
    );
  }
  if (bookingState.status === "success") {
    const booking = bookingState.booking;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, scale: 0.97 },
        animate: { opacity: 1, scale: 1 },
        className: "min-h-[70vh] flex items-center justify-center px-4",
        "data-ocid": "checkout.success_state",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-lg w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative inline-block", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 rounded-full bg-primary/20 blur-2xl scale-150" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative w-20 h-20 rounded-full border-2 border-primary/60 bg-primary/10 flex items-center justify-center mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-9 h-9 text-primary" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold text-foreground mt-6 mb-2", children: "Booking Confirmed" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "Thank you for choosing OK RENTALS. Your reservation is secured." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-primary/20 rounded-xl overflow-hidden shadow-lg", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-primary/5 border-b border-primary/15 px-6 py-4 flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold uppercase tracking-[0.25em] text-primary", children: "Booking Reference" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-foreground font-bold text-sm", children: [
                "#",
                booking.id.toString().slice(-8).toUpperCase()
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5 space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "w-4 h-4 text-muted-foreground" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-widest mb-0.5", children: "Vehicle" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground font-semibold", children: (vehicle == null ? void 0 : vehicle.name) ?? "—" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground capitalize", children: (vehicle == null ? void 0 : vehicle.color) ?? "" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-4 h-4 text-muted-foreground" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-widest mb-0.5", children: "Rental Period" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-foreground font-medium text-sm", children: [
                    formatDate(startDate),
                    " → ",
                    formatDate(endDate)
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                    days,
                    " day",
                    days > 1 ? "s" : ""
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "w-4 h-4 text-muted-foreground" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-widest mb-0.5", children: "Status" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground font-medium text-sm capitalize", children: booking.status === "pending" ? "Pending — awaiting admin approval" : booking.status === "approved" ? "Approved — ready for pickup" : booking.status === "active" ? "Active — vehicle is out" : booking.status === "completed" ? "Completed — returned and inspected" : booking.status === "returned" ? "Returned — deposit being released" : "Cancelled" })
                ] })
              ] }),
              idSubmitted && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { className: "w-4 h-4 text-primary" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-widest mb-0.5", children: "ID Verification" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-primary font-medium text-sm", children: "Submitted — pending admin review" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border pt-4 flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "Total Charged" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-xl font-bold text-primary", children: formatUSD(grandTotal) })
              ] })
            ] })
          ] }),
          (policies == null ? void 0 : policies.cancellationPolicy) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 bg-secondary/40 border border-border rounded-lg p-4 flex gap-3 items-start", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "w-4 h-4 text-primary flex-shrink-0 mt-0.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground leading-relaxed", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: "Cancellation Policy:" }),
              " ",
              policies.cancellationPolicy
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 bg-secondary/60 border border-border rounded-lg p-4 flex gap-3 items-start", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "w-4 h-4 text-primary flex-shrink-0 mt-0.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground leading-relaxed", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: "What's next?" }),
              " ",
              "Our concierge team will reach out via email or phone within 24 hours to arrange your pickup and drop-off details."
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 mt-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link,
              {
                to: "/account",
                className: "flex-1",
                "data-ocid": "checkout.view_bookings_link",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "outline",
                    className: "w-full border-border hover:border-primary/50",
                    children: "View My Bookings"
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link,
              {
                to: "/cars",
                className: "flex-1",
                "data-ocid": "checkout.browse_more_link",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "w-full bg-primary text-primary-foreground uppercase tracking-widest text-xs font-bold", children: "Browse More Vehicles" })
              }
            )
          ] })
        ] })
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", "data-ocid": "checkout.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border-b border-border py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => step === "select" ? navigate({ to: "/cars" }) : setStep("select"),
          className: "inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-200",
          "data-ocid": "checkout.back_link",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" }),
            step === "select" ? "Back to Fleet" : "Back"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-4 h-4 text-primary/60" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Secure Checkout" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-primary text-xs font-semibold uppercase tracking-[0.3em] mb-2", children: "Finalize Reservation" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl md:text-4xl font-bold text-foreground mb-6", children: step === "select" ? "Select Payment Method" : step === "insurance_waiver" ? "Insurance Waiver" : step === "id_verification" ? "ID Verification" : step === "credit_card" ? "Card Payment" : "Crypto Payment" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-10", "data-ocid": "checkout.step_indicator", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between max-w-lg mx-auto", children: [
            { label: "Select Vehicle", icon: Car, active: true },
            {
              label: "Choose Dates",
              icon: Calendar,
              active: !!vehicleId
            },
            {
              label: "Waiver",
              icon: ShieldCheck,
              active: step === "insurance_waiver" || step === "id_verification" || step === "credit_card" || step === "crypto"
            },
            {
              label: "Payment",
              icon: CircleCheck,
              active: step === "credit_card" || step === "crypto"
            }
          ].map((s, i, arr) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${s.active ? "bg-primary border-primary text-primary-foreground" : "bg-card border-border text-muted-foreground"}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(s.icon, { className: "w-4 h-4" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `text-[10px] uppercase tracking-widest mt-1.5 ${s.active ? "text-primary" : "text-muted-foreground"}`,
                  children: s.label
                }
              )
            ] }),
            i < arr.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `flex-1 h-0.5 mx-2 ${arr[i + 1].active ? "bg-primary" : "bg-border"}`
              }
            )
          ] }, s.label)) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-5 gap-8 items-start", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-3 space-y-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AnimatePresence, { mode: "wait", children: [
                step === "select" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.div,
                  {
                    initial: { opacity: 0, x: -16 },
                    animate: { opacity: 1, x: 0 },
                    exit: { opacity: 0, x: 16 },
                    className: "bg-card border border-border rounded-xl p-6",
                    "data-ocid": "checkout.payment_section",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xs font-semibold uppercase tracking-[0.25em] text-primary mb-5", children: "Choose How to Pay" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          className: "space-y-3",
                          "data-ocid": "checkout.payment_options",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              "button",
                              {
                                type: "button",
                                onClick: () => setStep("insurance_waiver"),
                                className: "w-full flex items-center gap-4 p-5 rounded-xl border-2 border-border hover:border-primary bg-transparent hover:bg-primary/5 text-left transition-all duration-200 group",
                                "data-ocid": "checkout.payment_credit_card_option",
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-shrink-0 flex gap-1", children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-[#1434CB] rounded px-1.5 py-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-white text-[10px]", children: "VISA" }) }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-8 h-5", children: [
                                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-0 w-4 h-4 rounded-full bg-[#EB001B] opacity-90 top-0.5" }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-1.5 w-4 h-4 rounded-full bg-[#F79E1B] opacity-90 top-0.5" })
                                    ] }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-[#2E77BC] rounded px-1.5 py-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-white text-[10px]", children: "AMEX" }) })
                                  ] }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground group-hover:text-primary transition-colors", children: "Credit / Debit Card" }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Visa, Mastercard, Amex — secured by Stripe" })
                                  ] }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4 text-muted-foreground group-hover:text-primary rotate-180 transition-colors" })
                                ]
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              "button",
                              {
                                type: "button",
                                onClick: () => setStep("insurance_waiver"),
                                className: "w-full flex items-center gap-4 p-5 rounded-xl border-2 border-border hover:border-primary bg-transparent hover:bg-primary/5 text-left transition-all duration-200 group",
                                "data-ocid": "checkout.payment_crypto_option",
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-shrink-0 flex gap-1.5 items-center", children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-6 h-6 rounded-full bg-[#F7931A] flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bitcoin, { className: "w-3.5 h-3.5 text-white" }) }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-6 h-6 rounded-full bg-[#627EEA] flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white text-xs font-bold", children: "Ξ" }) })
                                  ] }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground group-hover:text-primary transition-colors", children: "Cryptocurrency" }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Bitcoin, Ethereum & more" })
                                  ] }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4 text-muted-foreground group-hover:text-primary rotate-180 transition-colors" })
                                ]
                              }
                            )
                          ]
                        }
                      )
                    ]
                  },
                  "select"
                ),
                step === "insurance_waiver" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.div,
                  {
                    initial: { opacity: 0, x: 16 },
                    animate: { opacity: 1, x: 0 },
                    exit: { opacity: 0, x: -16 },
                    className: "bg-card border border-border rounded-xl p-6 space-y-5",
                    "data-ocid": "checkout.insurance_waiver_section",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "w-5 h-5 text-primary" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xs font-semibold uppercase tracking-[0.25em] text-primary", children: "Insurance Waiver" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-secondary border border-border rounded-lg p-4 max-h-64 overflow-y-auto text-sm text-muted-foreground leading-relaxed space-y-3", children: ((policies == null ? void 0 : policies.insuranceWaiverTerms) ?? "By signing below, you acknowledge that you are responsible for any damage caused by negligence, reckless driving, or violation of rental terms. Basic insurance is included; supplemental coverage is available upon request.").split("\n").map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: p }, `para-${p.slice(0, 20)}-${i}`)) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            id: "waiverAgree",
                            type: "checkbox",
                            checked: waiverAgreed,
                            onChange: (e) => setWaiverAgreed(e.target.checked),
                            className: "mt-1 w-4 h-4 accent-primary",
                            "data-ocid": "checkout.waiver_checkbox"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "label",
                          {
                            htmlFor: "waiverAgree",
                            className: "text-sm text-foreground cursor-pointer",
                            children: "I have read and agree to the insurance waiver"
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "block text-xs uppercase tracking-widest text-muted-foreground mb-2", children: "Full Legal Name (Digital Signature)" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Input,
                          {
                            value: waiverSignedName,
                            onChange: (e) => setWaiverSignedName(e.target.value),
                            placeholder: "Type your full legal name",
                            className: "text-sm",
                            "data-ocid": "checkout.waiver_name_input"
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          type: "button",
                          onClick: () => setStep("id_verification"),
                          disabled: !waiverAgreed || !waiverSignedName.trim(),
                          className: "w-full bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-[0.2em] font-bold text-xs h-12",
                          "data-ocid": "checkout.waiver_continue_button",
                          children: "Continue to ID Verification"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => setStep("select"),
                          className: "w-full text-center text-xs text-muted-foreground hover:text-primary transition-colors",
                          children: "← Back to Payment Selection"
                        }
                      )
                    ]
                  },
                  "insurance_waiver"
                ),
                step === "id_verification" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.div,
                  {
                    initial: { opacity: 0, x: 16 },
                    animate: { opacity: 1, x: 0 },
                    exit: { opacity: 0, x: -16 },
                    className: "bg-card border border-border rounded-xl p-6 space-y-5",
                    "data-ocid": "checkout.id_verification_section",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { className: "w-5 h-5 text-primary" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xs font-semibold uppercase tracking-[0.25em] text-primary", children: "ID Verification" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Upload a photo of your driver's license and enter the last 4 digits of your SSN. This is required before pickup and will be reviewed by our team." }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "block text-xs uppercase tracking-widest text-muted-foreground mb-2", children: "Driver's License Photo" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Input,
                            {
                              type: "file",
                              accept: "image/*",
                              onChange: async (e) => {
                                var _a;
                                const file = (_a = e.target.files) == null ? void 0 : _a[0];
                                if (!file) return;
                                const reader = new FileReader();
                                reader.onloadend = async () => {
                                  const base64 = reader.result;
                                  try {
                                    const res = await fetch(
                                      "/api/object-storage/upload",
                                      {
                                        method: "POST",
                                        headers: {
                                          "Content-Type": "application/json"
                                        },
                                        body: JSON.stringify({
                                          data: base64,
                                          filename: file.name
                                        })
                                      }
                                    );
                                    const json = await res.json();
                                    if (json == null ? void 0 : json.id) {
                                      setLicensePhotoId(json.id);
                                      ue.success("License photo uploaded");
                                    } else {
                                      ue.error("Upload failed");
                                    }
                                  } catch {
                                    ue.error("Upload failed");
                                  }
                                };
                                reader.readAsDataURL(file);
                              },
                              className: "text-sm",
                              "data-ocid": "checkout.license_upload_input"
                            }
                          ),
                          licensePhotoId && /* @__PURE__ */ jsxRuntimeExports.jsx(FileCheck, { className: "w-5 h-5 text-primary" })
                        ] }),
                        licensePhotoId && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-primary mt-1", children: "Photo uploaded successfully" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "block text-xs uppercase tracking-widest text-muted-foreground mb-2", children: "Last 4 Digits of SSN" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Input,
                          {
                            type: "password",
                            inputMode: "numeric",
                            maxLength: 4,
                            value: ssnLast4,
                            onChange: (e) => {
                              const val = e.target.value.replace(/\D/g, "");
                              setSsnLast4(val);
                            },
                            placeholder: "••••",
                            className: "text-sm font-mono tracking-widest",
                            "data-ocid": "checkout.ssn_input"
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          type: "button",
                          onClick: () => setStep("credit_card"),
                          disabled: !licensePhotoId || ssnLast4.length !== 4,
                          className: "w-full bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-[0.2em] font-bold text-xs h-12",
                          "data-ocid": "checkout.id_continue_button",
                          children: "Continue to Payment"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => setStep("insurance_waiver"),
                          className: "w-full text-center text-xs text-muted-foreground hover:text-primary transition-colors",
                          children: "← Back to Insurance Waiver"
                        }
                      )
                    ]
                  },
                  "id_verification"
                ),
                step === "credit_card" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.div,
                  {
                    initial: { opacity: 0, x: 16 },
                    animate: { opacity: 1, x: 0 },
                    exit: { opacity: 0, x: -16 },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => setStep("id_verification"),
                          className: "mb-4 text-xs text-muted-foreground hover:text-primary transition-colors",
                          children: "← Back to ID Verification"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        CreditCardSection,
                        {
                          onPaySuccess: (paymentMethodId) => doCreateBooking(PaymentMethod.creditCard, {
                            stripeSessionId: paymentMethodId
                          }),
                          onPayError: (msg) => {
                            setBookingState({ status: "error", message: msg });
                            ue.error("Payment failed", { description: msg });
                          },
                          isPending,
                          grandTotal
                        }
                      )
                    ]
                  },
                  "credit_card"
                ),
                step === "crypto" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.div,
                  {
                    initial: { opacity: 0, x: 16 },
                    animate: { opacity: 1, x: 0 },
                    exit: { opacity: 0, x: -16 },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => setStep("id_verification"),
                          className: "mb-4 text-xs text-muted-foreground hover:text-primary transition-colors",
                          children: "← Back to ID Verification"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        CryptoSection,
                        {
                          txHash,
                          setTxHash,
                          onSubmit: () => doCreateBooking(PaymentMethod.crypto, {
                            cryptoTxRef: txHash
                          }),
                          isPending
                        }
                      )
                    ]
                  },
                  "crypto"
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-secondary/40 border border-border rounded-xl p-5 flex gap-4 items-start", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-full bg-primary/10 border border-primary/25 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "w-4 h-4 text-primary" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground mb-1", children: "Pickup & Drop-off Arrangements" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground leading-relaxed", children: [
                    "Our team will reach out via",
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: "email or phone" }),
                    " to arrange your pickup and drop-off."
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: bookingState.status === "error" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.div,
                {
                  initial: { opacity: 0, y: -8 },
                  animate: { opacity: 1, y: 0 },
                  exit: { opacity: 0, y: -8 },
                  className: "bg-destructive/10 border border-destructive/30 rounded-xl p-5 flex gap-4 items-start",
                  "data-ocid": "checkout.error_state",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-5 h-5 text-destructive flex-shrink-0 mt-0.5" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-destructive-foreground mb-1", children: "Booking Failed" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: bookingState.message })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => setBookingState({ status: "idle" }),
                        className: "text-xs text-primary hover:underline flex-shrink-0",
                        "data-ocid": "checkout.retry_button",
                        children: "Try Again"
                      }
                    )
                  ]
                }
              ) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "bg-card border border-border rounded-xl overflow-hidden sticky top-28",
                "data-ocid": "checkout.order_summary",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-primary/5 border-b border-primary/15 px-6 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xs font-semibold uppercase tracking-[0.25em] text-primary", children: "Order Summary" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 py-5", children: vehicle ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5 pb-5 border-b border-border", children: [
                      vehicle.imageUrl && /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "img",
                        {
                          src: vehicle.imageUrl,
                          alt: vehicle.name,
                          className: "w-full h-24 object-cover rounded-lg mb-3"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-foreground text-base leading-tight", children: vehicle.name }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground capitalize mt-0.5", children: vehicle.color })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 mb-5 pb-5 border-b border-border", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-3.5 h-3.5 text-primary/60 mt-0.5 flex-shrink-0" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Pick Up" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground font-medium", children: formatDate(startDate) })
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-3.5 h-3.5 text-primary/60 mt-0.5 flex-shrink-0" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Drop Off" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground font-medium", children: formatDate(endDate) })
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3.5 h-3.5 text-primary/60 flex-shrink-0" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-foreground font-medium", children: [
                          days,
                          " day",
                          days > 1 ? "s" : "",
                          " rental"
                        ] })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2.5 mb-5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
                          formatUSD(dailyRate),
                          " × ",
                          days,
                          " day",
                          days > 1 ? "s" : ""
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: formatUSD(subtotal) })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Refundable Deposit" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: formatUSD(deposit) })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-primary/20 pt-4", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-baseline", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground", children: "Grand Total" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-2xl font-bold text-primary", children: formatUSD(grandTotal) })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Deposit refundable upon vehicle return" })
                    ] })
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "text-center py-6",
                      "data-ocid": "checkout.no_vehicle_state",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "w-8 h-8 text-muted-foreground/30 mx-auto mb-3" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "No vehicle selected." }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Link,
                          {
                            to: "/cars",
                            className: "text-primary text-xs hover:underline mt-2 inline-block",
                            "data-ocid": "checkout.browse_fleet_link",
                            children: "Browse Fleet →"
                          }
                        )
                      ]
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 pb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-center text-muted-foreground flex items-center justify-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-3 h-3" }),
                    "Secured by OK RENTALS"
                  ] }) })
                ]
              }
            ) })
          ] })
        ]
      }
    ) })
  ] });
}
export {
  CheckoutPage
};
