var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
// @ts-nocheck
var github = require('@actions/github');
var core = require('@actions/core');
var context = github.context;
var issue = context.payload.issue;
var labels = [];
var title = issue.title.toLowerCase();
var body = issue.body ? issue.body.toLowerCase() : '';
/**
 * Fetch the labels from action.yml file and verify them
 * @param labels the labels from the user
 * @returns all labels
 */
function GetLabels(labels) {
    var tempLabels = [];
    labels.forEach(function (_a) {
        var label = _a.label, match = _a.match;
        if (match.some(function (keyword) { return title.includes(keyword) || body.includes(keyword); })) {
            tempLabels.push({ label: label, match: match });
        }
    });
    return tempLabels.length > 0 ? tempLabels : undefined;
}
/**
 * Generate a random color in hex format (e.g., 'ff5733')
 */
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color.slice(1);
}
/**
 * Check if a label exists in the repository, if not, create it with a random color.
 */
function ensureLabelExists(octokit, owner, repo, label) {
    return __awaiter(this, void 0, void 0, function () {
        var error_1, randomColor;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 6]);
                    return [4 /*yield*/, octokit.rest.issues.getLabel({
                            owner: owner,
                            repo: repo,
                            name: label,
                        })];
                case 1:
                    _a.sent();
                    core.debug("Label \"".concat(label, "\" already exists."));
                    return [3 /*break*/, 6];
                case 2:
                    error_1 = _a.sent();
                    if (!(error_1.status === 404)) return [3 /*break*/, 4];
                    randomColor = getRandomColor();
                    core.debug("Label \"".concat(label, "\" not found, creating it with color #").concat(randomColor, "."));
                    return [4 /*yield*/, octokit.rest.issues.createLabel({
                            owner: owner,
                            repo: repo,
                            name: label,
                            color: randomColor,
                        })];
                case 3:
                    _a.sent();
                    core.info("Label \"".concat(label, "\" created with color #").concat(randomColor, "."));
                    return [3 /*break*/, 5];
                case 4: throw error_1;
                case 5: return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
(function () { return __awaiter(_this, void 0, void 0, function () {
    var token, octokit, _a, contextOwner, contextRepo, owner, repo, labelConfigInput, labelData, labelMapping, matched, _i, labelMapping_1, _b, label, match, error_2;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 9, , 10]);
                token = core.getInput('github-token', { required: true });
                octokit = github.getOctokit(token);
                _a = github.context.repo, contextOwner = _a.owner, contextRepo = _a.repo;
                owner = core.getInput('owner') || contextOwner;
                repo = core.getInput('repo') || contextRepo;
                labelConfigInput = core.getInput('label-config');
                labelData = GetLabels(labelConfigInput);
                labelMapping = labelConfigInput ? JSON.parse(labelConfigInput) : [];
                matched = false;
                _i = 0, labelMapping_1 = labelMapping;
                _c.label = 1;
            case 1:
                if (!(_i < labelMapping_1.length)) return [3 /*break*/, 4];
                _b = labelMapping_1[_i], label = _b.label, match = _b.match;
                if (!match.some(function (keyword) { return title.includes(keyword) || body.includes(keyword); })) return [3 /*break*/, 3];
                labels.push(label);
                matched = true;
                // Ensure the label exists in the repo, otherwise create it with a random color
                return [4 /*yield*/, ensureLabelExists(octokit, owner, repo, label)];
            case 2:
                // Ensure the label exists in the repo, otherwise create it with a random color
                _c.sent();
                _c.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4:
                if (!!matched) return [3 /*break*/, 6];
                labels.push('unknown');
                // Ensure the 'unknown' label exists in the repo
                return [4 /*yield*/, ensureLabelExists(octokit, owner, repo, 'unknown')];
            case 5:
                // Ensure the 'unknown' label exists in the repo
                _c.sent();
                _c.label = 6;
            case 6:
                if (!(labels.length > 0)) return [3 /*break*/, 8];
                return [4 /*yield*/, octokit.rest.issues.addLabels({
                        owner: context.repo.owner,
                        repo: context.repo.repo,
                        issue_number: issue.number,
                        labels: labels
                    })];
            case 7:
                _c.sent();
                _c.label = 8;
            case 8:
                console.log("\n            -------------------------------------------------\n            \uD83C\uDF89 Success! Issue/PRs have been labeled successfully.\n            Thank you for using this action! \u2013 Vedansh \u2728\n            -------------------------------------------------\n        ");
                return [3 /*break*/, 10];
            case 9:
                error_2 = _c.sent();
                core.error(error_2);
                core.setFailed("Failed to label pr or issue: ".concat(error_2.message));
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); })();
