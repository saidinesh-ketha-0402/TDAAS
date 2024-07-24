import { Component } from '@angular/core';
import { AuthenticationService } from 'src/services/authentication.service';
import { AssistantService } from 'src/services/assistant.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-prompt2-code',
  templateUrl: './prompt2-code.component.html',
  styleUrls: ['./prompt2-code.component.css']
})
export class Prompt2CodeComponent {
  public userPromptTextAreaLabel: string = "Query to get modus components"
  public userPromptTextAreaPlaceholder: string = "Post your query"
  public userPromptHelperText: string = "For better results keep your query as detailed and accurate as possible. It might take ~1minute to get the output."

  public progressBarValue = 0
  public progressBarMaxValue = 5
  public progressBarHidden = true
  private progressBarIntervalId: any = null;
  public showAlert: boolean = false

  public showOutput: boolean = false
  public outputHTMLCode: string = ""
  public outputScriptCode: string = ""

  constructor(private authService: AuthenticationService,
    private assistantService: AssistantService,
    private router: Router) {
  }

  public async generateClicked(textArea: any) {
    console.log(textArea.value);
    // this.progressBarValue = 0;
    this.showAlert = false
    this.displayProgressBar()
    var isAutherized = await this.authService.ValidateAuthentication()
    if (!isAutherized) {
      this.router.navigate(['authentication']);
      return;
    }

    var response = await this.assistantService.GetAssistantResponseForMessage(textArea.value)
    console.log("Response result is " + response);
    this.progressBarValue = 0;
    this.progressBarHidden = true;
    this.onResponseReceived();
    
    if(response == undefined){
      this.showAlert = true
      this.outputHTMLCode = ""
      this.outputScriptCode = ""
      return;
    }

    this.outputHTMLCode = this.extractCodeBlocks(response, "html")
    this.outputScriptCode = this.extractCodeBlocks(response, "typescript")
    
    if(this.outputHTMLCode == "" && this.outputScriptCode == ""){
      this.showAlert = true;
      return;
    }

    if(this.outputScriptCode == ""){
      this.outputScriptCode = "// No typescript code required for this query.";
    }

    this.showOutput = true
  }

  public onBackPressed() {
    this.showOutput = false;
    this.progressBarHidden = true;
    this.showAlert = false;
    this.progressBarValue = 0;
  }

  private displayProgressBar() {
    this.progressBarHidden = false;
    // Store the interval ID
    this.progressBarIntervalId = setInterval(() => {
      this.progressBarValue++;
  
      if (this.progressBarValue == this.progressBarMaxValue - 1) {
        clearInterval(this.progressBarIntervalId);
      }
    }, 10000);
  }
  
  // Method to be called after receiving a response
  private onResponseReceived() {
    // Clear the interval if it's running
    if (this.progressBarIntervalId !== null) {
      clearInterval(this.progressBarIntervalId);
      this.progressBarIntervalId = null; // Reset the ID
    }
    // Additional response handling logic here
  }

  // private extractCodeBlocks(input: string, language: string): string {
  //   const startMarker = `\`\`\`${language}`;
  //   const endMarker = `\`\`\``;
  //   const startIndex = input.indexOf(startMarker) + startMarker.length;
  //   const endIndex = input.indexOf(endMarker, startIndex);
  //   if (startIndex < 0 || endIndex < 0) {
  //     return ''; // Return an empty string if markers are not found
  //   }
  //   return input.substring(startIndex, endIndex).trim();
  // }

  private extractCodeBlocks(input: string, language: string): string {
    const startMarker = `\`\`\`${language}`;
    const endMarker = `\`\`\``;
    const markerIndex = input.indexOf(startMarker);
    if (markerIndex === -1) {
      return ''; // Return an empty string immediately if the start marker is not found
    }
    const startIndex = markerIndex + startMarker.length;
    const endIndex = input.indexOf(endMarker, startIndex);
    if (endIndex < 0) {
      return ''; // Return an empty string if the end marker is not found
    }
    return input.substring(startIndex, endIndex).trim();
  }
}
