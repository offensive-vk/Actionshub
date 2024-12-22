import * as core from "@actions/core";
import * as aggregate from "./aggregate-user-info";
import * as template from "./color-template";
import * as create from "./create-svg";
import * as f from "./file-writer";
import * as r from "./settings-reader";
import * as client from "./github-graphql";
import * as process from "node:process";

export const main = async (): Promise<void> => {
  try {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      core.setFailed("GITHUB_TOKEN is empty");
      return;
    }
    const userName = 3 <= process.argv.length
      ? process.argv[2]
      : process.env.USERNAME;
    if (!userName) {
      core.setFailed("USERNAME is empty");
      return;
    }
    const maxRepos = process.env.MAX_REPOS
      ? Number(process.env.MAX_REPOS)
      : 100;
    if (Number.isNaN(maxRepos)) {
      core.setFailed("MAX_REPOS is NaN");
      return;
    }

    const response = await client.fetchData(token, userName, maxRepos);
    const userInfo = aggregate.aggregateUserInfo(response);

    if (process.env.SETTING_JSON) {
      const settingFile = r.readSettingJson(process.env.SETTING_JSON);
      const settingInfos = "length" in settingFile
        ? settingFile
        : [settingFile];
      for (const settingInfo of settingInfos) {
        const fileName = settingInfo.fileName || "customize.svg";
        f.writeFile(
          fileName,
          create.createSvg(userInfo, settingInfo, false),
        );
      }
    } else {
      const settings = userInfo.isHalloween
        ? template.HalloweenSettings
        : template.NormalSettings;

      f.writeFile(
        "green-animate.svg",
        create.createSvg(userInfo, settings, true),
      );
      f.writeFile(
        "green.svg",
        create.createSvg(userInfo, settings, false),
      );
      f.writeFile(
        "season-animate.svg",
        create.createSvg(userInfo, template.NorthSeasonSettings, true),
      );
      f.writeFile(
        "season.svg",
        create.createSvg(userInfo, template.NorthSeasonSettings, false),
      );
      f.writeFile(
        "south-season-animate.svg",
        create.createSvg(userInfo, template.SouthSeasonSettings, true),
      );
      f.writeFile(
        "south-season.svg",
        create.createSvg(userInfo, template.SouthSeasonSettings, false),
      );

      f.writeFile(
        "night-view.svg",
        create.createSvg(userInfo, template.NightViewSettings, true),
      );

      f.writeFile(
        "night-green.svg",
        create.createSvg(userInfo, template.NightGreenSettings, true),
      );

      f.writeFile(
        "night-rainbow.svg",
        create.createSvg(userInfo, template.NightRainbowSettings, true),
      );

      f.writeFile(
        "gitblock.svg",
        create.createSvg(userInfo, template.GitBlockSettings, true),
      );
    }
  } catch (error) {
    console.error(error);
    core.setFailed("error");
  }
};

void main();
