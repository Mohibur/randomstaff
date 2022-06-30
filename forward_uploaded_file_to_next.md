# this is written on spring boot
# add the following maven repo
```xml
<!-- https://mvnrepository.com/artifact/org.apache.httpcomponents/httpclient -->
        <dependency>
            <groupId>org.apache.httpcomponents</groupId>
            <artifactId>httpclient</artifactId>
        </dependency>
        <!-- https://mvnrepository.com/artifact/org.apache.httpcomponents/httpmime -->
        <dependency>
            <groupId>org.apache.httpcomponents</groupId>
            <artifactId>httpmime</artifactId>
        </dependency>
```



```java
package simple.mind.cmsa;

import java.io.IOException;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpUriRequest;
import org.apache.http.client.methods.RequestBuilder;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.mime.HttpMultipartMode;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
public class CmsACtrl {
  private String url = "http://localhost:8081/upload/";

  @GetMapping("/")
  public String index() {
    return //
    "    <html>" + //
        "  <body>" + //
        "    <form action='/upload/'  method='post'  enctype='multipart/form-data'>" + //
        "      <input type='file' id='myFile' name='filename'>" + //
        "      <input type='submit'>" + //
        "    </form>" + //
        "  </body>" + //
        "</html>";
  }

  @PostMapping(value = "/upload/")
  public String uploadImages(@RequestPart("filename") final MultipartFile file) throws IOException {


    // Creating CloseableHttpClient object
    CloseableHttpClient httpclient = HttpClients.createDefault();

    // Creating the MultipartEntityBuilder
    MultipartEntityBuilder entitybuilder = MultipartEntityBuilder.create();

    // Setting the mode
    entitybuilder.setMode(HttpMultipartMode.BROWSER_COMPATIBLE);


    // Adding a file
    entitybuilder.addBinaryBody("filename", file.getInputStream(), ContentType.create(file.getContentType()),
        file.getOriginalFilename());

    // Building a single entity using the parts
    HttpEntity mutiPartHttpEntity = entitybuilder.build();
    System.out.println(mutiPartHttpEntity.toString());

    // Building the RequestBuilder request object
    RequestBuilder reqbuilder = RequestBuilder.post(url);

    // Set the entity object to the RequestBuilder
    reqbuilder.setEntity(mutiPartHttpEntity);

    // Building the request
    HttpUriRequest multipartRequest = reqbuilder.build();
    System.out.println(httpclient.toString());
    // Executing the request
    HttpResponse httpresponse = httpclient.execute(multipartRequest);
    return httpresponse.getStatusLine().toString();
  }
}
```
