import * as path from 'path';
import * as fs from 'fs-extra';
import * as yaml from 'yaml';
import R2Error from 'src/model/errors/R2Error';
import YamlParseError from 'src/model/errors/Yaml/YamlParseError';
import FileWriteError from 'src/model/errors/FileWriteError';
import YamlConvertError from 'src/model/errors/Yaml/YamlConvertError';

const configPath: string = path.join(process.cwd(), 'config');
const configFile: string = path.join(configPath, 'conf.yml');

export default class ManagerSettings {

    public riskOfRain2Directory: string | null = null;
    public linkedFiles: string[] = [];

    public load(): R2Error | void {
        if (!fs.pathExistsSync(configPath)) {
            fs.mkdirsSync(configPath);
        }
        if (fs.existsSync(configFile)) {
            try {
                const parsedYaml = yaml.parse(fs.readFileSync(configFile).toString());
                this.riskOfRain2Directory = parsedYaml.riskOfRain2Directory;
                this.linkedFiles = parsedYaml.linkedFiles;
            } catch(e) {
                const err: Error = e;
                return new YamlParseError(
                    'Failed to parse conf.yml',
                    err.message
                )
            }
        }
    }

    public setRiskOfRain2Directory(dir: string): R2Error | void {
        this.riskOfRain2Directory = dir;
        return this.save();
    }

    public setLinkedFiles(linkedFiles: string[]): R2Error | void {
        this.linkedFiles = linkedFiles;
        return this.save();
    }

    private save(): R2Error | void {
        try {
            const writeableYaml = yaml.stringify(this);
            try {
                fs.writeFileSync(configFile, writeableYaml);
            } catch(e) {
                const err: Error = e;
                return new FileWriteError(
                    'Failed to write conf.yml',
                    err.message
                )
            }
        } catch(e) {
            const err: Error = e;
            return new YamlConvertError(
                'Failed to write convert yaml',
                err.message
            )
        }
    }

}